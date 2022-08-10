import classNames from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { BaseEditor, Editor, Text } from "slate";
import { ReactEditor } from "slate-react";
import { Call, renderCall } from "../lib/bridge";
import { db } from "../lib/db";
import { emptyRichText, RichText, TextEditor } from "../lib/editor";
import { AppDispatch, useAppDispatch, useAppSelector } from "../lib/state";
import { BidInfo, setCallMeaning, TableState } from "../lib/tableState";

export const EmptyCallItem: FunctionComponent = () => {
  return <div className="rounded-md border bg-stripes-neutral p-4" />;
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
  const { id: tableId, readOnly } = useAppSelector(state => state.table as TableState & { state: "ready" });
  const dispatch = useAppDispatch();

  const onMeaningChange = useCallback((t: RichText, editor: BaseEditor & ReactEditor) => {
    const [match] = Editor.nodes(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
      match: n => Text.isText(n) && !!n.text,
    });
    dispatch(setMeaning(tableId, call, match ? t : null));
  }, [dispatch, tableId, call]);

  return <div className="rounded-md border flex flex-col divide-y overflow-hidden">
    <div className="grow-0 shrink-0 flex flex-row h-16 items-center px-2">
      <a className={classNames("table float-left w-12 h-12 border rounded-full bg-white", { "hover:bg-neutral-300": link !== null })}>
        <span className="table-cell align-middle font-emoji text-lg text-center">{renderCall(call)}</span>
      </a>
    </div>
    <TextEditor
      className="grow p-3 bg-neutral-100 max-h-64 overflow-y-auto"
      initialValue={meaning ?? emptyRichText}
      onChange={onMeaningChange}
      readOnly={readOnly}
    />
  </div>;
};
