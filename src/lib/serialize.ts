import { YAMLMap } from "yaml";
import { Bid, Call, isBid, isCall } from "./bridge";
import { db, DBTableBrief, Link, Meaning } from "./db";
import { emptyRichText, RichText } from "./editor";

type SerializedDocument = YAMLMap<number, SerializedTable>;
type SerializedTable = {
  title: string;
  firstBid: Bid;
  description: SerializedRichText;
  items: Partial<Record<Call, SerializedItem>>;
};
type SerializedItem = {
  meaning?: SerializedRichText;
  link?: number;
};
type SerializedRichText = string[];

const escapedTokens = {
  "*": "*",
  "♠": "S",
  "♥": "H",
  "♦": "D",
  "♣": "C",
  "\\": "\\",
};

function escape(s: string): string {
  return s.replace(/[*♠♥♦♣\\]/g, match => {
    return "\\" + escapedTokens[match as keyof typeof escapedTokens];
  });
}

const unescapedTokens = {
  "*": "*",
  "S": "♠",
  "H": "♥",
  "D": "♦",
  "C": "♣",
  "\\": "\\",
};

function unescape(s: string): string {
  return s.replace(/\\[*SHDC\\]/g, match => {
    return unescapedTokens[match[1] as keyof typeof unescapedTokens];
  });
}

function serializeRichText(t: RichText): SerializedRichText {
  return t.map(paragraph =>
    paragraph.children
      .map(text => {
        const escaped = escape(text.text);
        return text.bold ? `**${escaped}**` : escaped;
      })
      .join("")
  );
}

function deserializeRichText(serialized: unknown): RichText {
  if (serialized instanceof Array) {
    const t: RichText = [];
    for (const s of serialized) {
      if (typeof s !== "string") continue;
      t.push({
        type: "paragraph",
        children: s.split("**").map((part, i) => {
          const text = unescape(part);
          return i % 2 === 0 ? { text } : { text, bold: true };
        }),
      });
    }
    return t.length === 0 ? emptyRichText : t;
  } else {
    return emptyRichText;
  }
}

export async function serializeDB(): Promise<SerializedDocument> {
  const document: SerializedDocument = new YAMLMap();

  await db.transaction("r", [db.briefs, db.meanings, db.links], async () => {
    await db.briefs.each(({ id, title, firstBid, description }) => {
      document.set(id, {
        title: escape(title),
        firstBid,
        description: serializeRichText(description),
        items: {},
      });
    });

    const meaningPromise = db.meanings.each(({ tableId, call, meaning }) => {
      const items = document.get(tableId)!.items;
      items[call] = {
        ...items[call],
        meaning: serializeRichText(meaning),
      };
    });

    const linkPromise = db.links.each(({ tableId, call, link }) => {
      const items = document.get(tableId)!.items;
      items[call] = {
        ...items[call],
        link,
      };
    });

    await Promise.all([meaningPromise, linkPromise]);
  });

  return document;
}

export async function deserializeDB(document: unknown): Promise<void> {
  db.close();
  await db.delete();
  await db.open();

  if (typeof document !== "object" || document == null) {
    return;
  }

  const tableEntries = Object.entries(document)
    .filter(([k, v]) =>
      /^\d+$/.test(k) && typeof v === "object" && v && typeof (v as Partial<SerializedTable>).title === "string")
    .map(([k, v]) => {
      const id = parseInt(k);
      const { title, firstBid, description, items } = v as { title: string } & Partial<Record<"title" | "firstBid" | "description" | "items", unknown>>;
      return [
        {
          id,
          title: unescape(title),
          firstBid: typeof firstBid === "string" && isCall(firstBid) && isBid(firstBid) ? firstBid : "1C",
          description: deserializeRichText(description),
        },
        typeof items === "object" && items ? items : [],
      ] as [DBTableBrief, Record<any, SerializedItem>];
    });

  const tableIdSet = new Set(tableEntries.map(e => e[0].id));

  const meanings: Meaning[] = [];
  const links: Link[] = [];

  for (const [{ id }, items] of tableEntries) {
    for (const [k, v] of Object.entries(items)) {
      if (!isCall(k) || typeof v !== "object" || !v) continue;
      if (v.meaning !== undefined) {
        const t = deserializeRichText(v.meaning);
        if (t !== emptyRichText) {
          meanings.push({
            tableId: id,
            call: k,
            meaning: t,
          });
        }
      }
      if (typeof v.link === "number" && tableIdSet.has(v.link)) {
        links.push({
          tableId: id,
          call: k,
          link: v.link,
        });
      }
    }
  }

  return db.transaction("rw", [db.briefs, db.meanings, db.links], async () => {
    await Promise.all([
      db.briefs.bulkAdd(tableEntries.map(e => e[0])),
      db.meanings.bulkAdd(meanings),
      db.links.bulkAdd(links),
    ]);
  });
}
