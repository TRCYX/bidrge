import React, { FunctionComponent, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { TableBrief } from "../lib/tableState";
import { useAppSelector } from "../lib/state";
import { renderCall } from "../lib/bridge";
import { DeleteTableModal } from "./DeleteTableModal";
import { useBoolean } from "ahooks";
import { Input } from "./Input";
import { useCallback } from "react";

type TableOptionProps = {
  table: TableBrief;
  visible: boolean;
  deletable?: boolean;
  onSelect?(table: TableBrief): void;
};

const TableOption: FunctionComponent<TableOptionProps> = ({ table, visible, deletable, onSelect }) => {
  const [
    deleteTableModalOpen,
    {
      setTrue: openDeleteTableModal,
      setFalse: closeDeleteTableModal,
    },
  ] = useBoolean(false);

  return <div
    className={classNames({ "hidden": !visible }, "px-3 box-content border-b first:border-t flex flex-row items-center", { "hover:cursor-pointer": onSelect })}
    onClick={() => onSelect && onSelect(table)}
  >
    <div className="font-emoji my-3 text-lg grow shrink truncate">{table.title}</div>
    <div className="font-emoji ml-auto my-3 text-lg">{renderCall(table.firstBid)}</div>
    {deletable && <button
      className="ml-3 w-10 h-10 min-w-[2.5rem] border rounded-full"
      onClick={e => {
        e.stopPropagation();
        openDeleteTableModal();
      }}
    >
      D
    </button>}
    {deleteTableModalOpen && <DeleteTableModal open nested table={table} onClose={closeDeleteTableModal} />}
  </div>;
};

export type TableSelectorProps = {
  deletable?: boolean;
  onSelect?(table: TableBrief): void;
  onClose(): void;
};

export const TableSelector: FunctionComponent<TableSelectorProps> = ({ deletable, onSelect, onClose }) => {
  const { t } = useTranslation();

  const tables = useAppSelector(state => state.nav);

  const [searchString, setSearchString] = useState("");

  const handleSelect = useCallback((table: TableBrief) => {
    onSelect && onSelect(table);
    onClose();
  }, [onSelect, onClose]);

  if (tables.state === "loading") {
    // TODO
    return <div className="w-96 h-96 bg-neutral-200">???</div>;
  } else {
    return <div className="w-96">
      <div className="rounded-lg bg-white w-full mb-1 h-96 border flex flex-col shadow-[0_-1px_3px_0_rgba(0,0,0,0.1),0_-1px_2px_-1px_rgba(0,0,0,0.1)] divide-y">
        <div className="bg-neutral-200 py-3 px-3 flex">
          <Input className="grow rounded-md py-2 px-4 min-w-0" placeholder={t`search`} value={searchString} onChange={setSearchString} />
        </div>
        <div className="grow flex flex-col overflow-y-auto">
          {tables.tables.map(table => <TableOption
            key={table.title ?? 0}
            table={table}
            visible={!!((table.title ?? t`opening`)?.includes(searchString))}
            deletable={deletable}
            onSelect={handleSelect}
          />)}
        </div>
      </div>
    </div>;
  }
};
