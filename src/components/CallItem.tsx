import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { Call, renderCall } from "../lib/bridge";
import { db } from "../lib/db";
import { RichText, TextEditor } from "../lib/editor";
import { AppDispatch, useAppDispatch, useAppSelector } from "../lib/state";
import { BidInfo, setCallMeaning, TableState } from "../lib/tableState";

export const IllegalCallItem: FunctionComponent = () => {
  return <div className="rounded-md border bg-stripes-zinc p-4" />;
};

const setMeaning = (tableId: number, call: Call, meaning: RichText | null) => async (dispatch: AppDispatch) => {
  dispatch(setCallMeaning({ call, meaning }));
  db.transaction("rw", [db.meanings], async () => {
    if (meaning === null) {
      return db.meanings.delete([tableId, call]);
    } else {
      return db.meanings.put({ tableId, call, meaning });
    }
  });
};

export type BidItemPropsWithBid = BidInfo & {
  call: Call;
};

export const CallItem: FunctionComponent<BidItemPropsWithBid> = ({ call, meaning, link }) => {
  const tableId = useAppSelector(state => (state.table as TableState & { state: "ready" }).id);
  const dispatch = useAppDispatch();

  return <div className="rounded-md border flex flex-col divide-y">
    <div className="grow-0 shrink-0 p-2">
      <a className={classNames("table float-left w-12 h-12 border rounded-full bg-white", { "hover:bg-zinc-300": link !== null })}>
        <span className="table-cell align-middle font-emoji text-lg text-center">{renderCall(call)}</span>
      </a>
    </div>
    <div className="grow p-3 bg-zinc-100">
      <TextEditor
        initialValue={meaning}
        onChange={t => dispatch(setMeaning(tableId, call, t))}
      />
    </div>
  </div>;
};
