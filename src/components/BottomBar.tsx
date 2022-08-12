import React, { FunctionComponent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Popup } from "reactjs-popup";
import { AppDispatch, store, useAppDispatch, useAppSelector } from "../lib/state";
import { shallowEqual } from "react-redux";
import { EditTableInfoModal } from "./EditTableInfoModal";
import { TableSelector } from "./TableSelector";
import { useBoolean } from "ahooks";
import { Call } from "../lib/bridge";
import { db } from "../lib/db";
import { RichText } from "../lib/editor";
import { TableBrief, setTableLoading, setTableReady, setTableEmpty } from "../lib/tableState";
import { useCallback } from "react";
import { deserializeDB, serializeDB } from "../lib/serialize";
import { parse, stringify } from "yaml";
import { saveAs } from "file-saver";
import { setNavLoading, setNavReady } from "../lib/navState";

export const setActiveTable = (brief: TableBrief) => async (dispatch: AppDispatch) => {
  dispatch(setTableLoading(brief));

  const table = await db.transaction("r", [db.briefs, db.meanings, db.links], async () => {
    const meanings: Partial<Record<Call, RichText>> = {};
    const meaningsPromise = db.meanings.where("tableId").equals(brief.id).each(m => {
      meanings[m.call] = m.meaning;
    });

    const links: Partial<Record<Call, TableBrief>> = {};
    const linksPromise = (async () => {
      const linkArr = await db.links.where("tableId").equals(brief.id).toArray();
      const briefArr = await Promise.all(linkArr.map(l => db.briefs.get(l.link)));
      for (let i = 0; i < linkArr.length; ++i) {
        const { id, title, firstBid } = briefArr[i]!;
        links[linkArr[i].call] = { id, title, firstBid };
      }
    })();

    const [description, ,] = await Promise.all([
      db.briefs.get(brief.id).then(b => b!.description),
      meaningsPromise,
      linksPromise,
    ]);

    return {
      ...brief,
      description,
      meanings,
      links,
    };
  });

  dispatch(setTableReady(table));
};

async function download() {
  const serialized = await serializeDB();
  const stringified = stringify(serialized, {
    simpleKeys: true,
    singleQuote: false,
  });
  saveAs(new Blob([stringified], { type: "application/x-yaml; charset=utf-8" }), "bid.yml");
}

export async function loadNavState() {
  const briefs = await db.transaction("r", [db.briefs], () => {
    return db.briefs.orderBy("id").toArray();
  });
  store.dispatch(setNavReady(briefs.map(({ id, title, firstBid }) => ({ id, title, firstBid } as TableBrief))));
}

const upload = (file: File) => async (dispatch: AppDispatch) => {
  dispatch(setNavLoading());
  dispatch(setTableEmpty());
  const stringified = await file.text();
  try {
    const serialized = parse(stringified, {
      strict: false,
      uniqueKeys: false,
      maxAliasCount: 0,
    });
    await deserializeDB(serialized);
  } catch (e) {
    console.log(e);
  }
  
  await loadNavState();
};

export const BottomBar: FunctionComponent = () => {
  const { t } = useTranslation();

  const activeTableBrief = useAppSelector(
    state => {
      if (state.table.state !== "empty") {
        const { id, title, firstBid } = state.table;
        return { id, title, firstBid };
      } else {
        return null;
      }
    },
    shallowEqual,
  );

  const [
    createTableModalOpen,
    {
      setTrue: openCreateTableModal,
      setFalse: closeCreateTableModal,
    },
  ] = useBoolean(false);

  const dispatch = useAppDispatch();
  const onSelectTable = useCallback((table: TableBrief) => {
    dispatch(setActiveTable(table));
  }, [dispatch]);

  const navigate = useNavigate();

  const uploadInputRef = useRef<HTMLInputElement>(null);

  return <nav className="w-full bg-amber-500 flex flex-row px-4 py-3 text-lg shadow-[0_-1px_3px_0_rgba(0,0,0,0.1),0_-1px_2px_-1px_rgba(0,0,0,0.1)]">
    <div className="w-56 mx-6 flex flex-row">
      <button
        type="button"
        className="rounded-full py-1.5 px-3 w-12 h-12 bg-white flex justify-center items-center"
        onClick={() => navigate(-1)}
      >
        <span className="font-bold">&lt;</span>
      </button>
      <button
        type="button"
        className="ml-auto rounded-full py-1.5 px-3 w-12 h-12 bg-white flex justify-center items-center"
        onClick={() => navigate(1)}
      >
        <span className="font-bold">&gt;</span>
      </button>
    </div>
    <div className="ml-4 w-96">
      <div className="w-full h-full rounded-lg bg-white flex flex-row divide-x">
        <div className="py-1.5 px-3 my-auto rounded-l-lg grow shrink min-w-0 truncate">
          {activeTableBrief != null && <span className="font-emoji">{activeTableBrief.title}</span>}
          {activeTableBrief == null && <span className="text-neutral-400">{t`noSelectedTable`}</span>}
        </div>
        <Popup
          position="top right"
          arrow={false}
          trigger={<button type="button" className="py-1.5 px-3 rounded-r-lg flex items-center">^</button>}
          nested
        >
          {((close: () => void) => <TableSelector deletable onSelect={onSelectTable} onClose={close} />) as any}
        </Popup>
      </div>
    </div>
    <div className="ml-4">
      <button
        type="button"
        className="rounded-full py-1.5 px-3 w-12 h-12 bg-white flex justify-center items-center"
        onClick={openCreateTableModal}
      >
        <span className="font-bold">+</span>
      </button>
      {createTableModalOpen && <EditTableInfoModal open onClose={closeCreateTableModal} />}
    </div>
    <button type="button" className="ml-auto rounded-lg py-1.5 px-3 w-40 bg-white flex justify-center items-center" onClick={download}>
      <div className="font-bold text-lg">{t`download...`}</div>
    </button>
    <button className="ml-4 rounded-lg py-1.5 px-3 w-40 bg-white flex justify-center items-center" onClick={() => { uploadInputRef.current?.click(); }}>
      <div className="font-bold text-lg">{t`upload...`}</div>
    </button>
    <input type="file" accept=".yml,*" hidden ref={uploadInputRef} onChange={e => {
      const fileUploaded = e.target.files && e.target.files[0];
      if (fileUploaded) {
        dispatch(upload(fileUploaded));
      }
    }} />
  </nav>;
};
