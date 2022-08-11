import React, { ChangeEvent, FunctionComponent, useCallback, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { setTableLoading, setTableReady, TableBrief } from "../lib/tableState";
import { AppDispatch, useAppDispatch, useAppSelector } from "../lib/state";
import { db } from "../lib/db";
import { Call, renderCall } from "../lib/bridge";
import { DeleteTableModal } from "./DeleteTableModal";
import { RichText } from "../lib/editor";
import { useBoolean } from "ahooks";

const setActiveTable = (brief: TableBrief) => async (dispatch: AppDispatch) => {
  dispatch(setTableLoading(brief));

  const table = await db.transaction("r", [db.meanings, db.links], async () => {
    const meanings: Partial<Record<Call, RichText>> = {};
    await db.meanings.where("tableId").equals(brief.id).each(m => {
      meanings[m.call] = m.meaning;
    });

    const links: Partial<Record<Call, number>> = {};
    await db.links.where("tableId").equals(brief.id).each(l => {
      links[l.call] = l.link;
    });

    return {
      ...brief,
      meanings,
      links,
    };
  });

  dispatch(setTableReady(table));
};

type TableOptionProps = {
  table: TableBrief;
  visible: boolean;
};

const TableOption: FunctionComponent<TableOptionProps> = ({ table, visible }) => {
  const dispatch = useAppDispatch();
  const [
    deleteTableModalOpen,
    {
      setTrue: openDeleteTableModal,
      setFalse: closeDeleteTableModal,
    },
  ] = useBoolean(false);

  return <div
    className={classNames({ "hidden": !visible }, "px-3 box-content border-b first:border-t flex flex-row hover:cursor-pointer items-center")}
    onClick={() => dispatch(setActiveTable(table))}
  >
    <div className="my-3 text-lg grow shrink truncate">{table.title}</div>
    <div className="font-emoji ml-auto my-3 text-lg">{renderCall(table.firstBid)}</div>
    <button
      className="ml-3 w-10 h-10 min-w-[2.5rem] border rounded-full"
      onClick={e => {
        e.stopPropagation();
        openDeleteTableModal();
      }}
    >
      D
    </button>
    {deleteTableModalOpen && <DeleteTableModal open nested table={table} onClose={closeDeleteTableModal} />}
  </div>;
};

export const TableSelector: FunctionComponent = () => {
  const { t } = useTranslation();

  const tables = useAppSelector(state => state.nav);

  const [searchString, setSearchString] = useState("");
  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value), []);

  if (tables.state === "loading") {
    // TODO
    return <div className="w-96 h-96 bg-neutral-200">???</div>;
  } else {
    return <div className="w-96">
      <div className="rounded-lg bg-white w-full mb-1 h-96 border flex flex-col shadow-[0_-1px_3px_0_rgba(0,0,0,0.1),0_-1px_2px_-1px_rgba(0,0,0,0.1)] divide-y">
        <div className="bg-neutral-200 py-3 px-3 flex">
          <input className="grow rounded-md py-2 px-4" placeholder={t`search`} value={searchString} onChange={onInputChange} />
        </div>
        <div className="grow flex flex-col overflow-y-auto">
          {tables.tables.map(table => <TableOption
            key={table.title ?? 0}
            table={table}
            visible={!!((table.title ?? t`opening`)?.includes(searchString))} />)}
        </div>
      </div>
    </div>;
  }
};
