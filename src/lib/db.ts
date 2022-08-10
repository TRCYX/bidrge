import Dexie, { Table } from "dexie";
import { Bid, Call } from "./bridge";
import { RichText } from "./editor";

export type DBTableBrief = {
  id?: number;
  title: string;
  firstBid: Bid;
  description: RichText;
};

export type Meaning = {
  tableId: number;
  call: Call;
  meaning: RichText;
};

export type Link = {
  tableId: number;
  call: Call;
  link: number;
};

class Database extends Dexie {
  briefs!: Table<DBTableBrief>;
  meanings!: Table<Meaning>;
  links!: Table<Link>;

  constructor() {
    super("bidrge");
    this.version(1).stores({
      briefs: "++id",
      meanings: "[tableId+call]",
      links: "[tableId+call], link",
    });
  }
}

export const db = new Database();
