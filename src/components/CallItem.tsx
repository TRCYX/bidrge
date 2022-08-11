import React, { FunctionComponent, useCallback } from "react";
import Popup from "reactjs-popup";
import { BaseEditor, Editor, Text } from "slate";
import { ReactEditor } from "slate-react";
import { Call, renderCall } from "../lib/bridge";
import { db } from "../lib/db";
import { emptyRichText, RichText, TextEditor } from "../lib/editor";
import { AppDispatch, useAppDispatch, useAppSelector } from "../lib/state";
import { BidInfo, setCallLink, setCallMeaning, TableBrief, TableState } from "../lib/tableState";
import { setActiveTable } from "./BottomBar";
import { CircularButton } from "./CircularButton";
import { TableSelector } from "./TableSelector";

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

const setLink = (tableId: number, call: Call, link: TableBrief) => async (dispatch: AppDispatch) => {
  dispatch(setCallLink({ call, link }));
  db.transaction("rw", [db.links], async () => {
    return db.links.put({ tableId, call, link: link.id });
  });
}

const removeLink = (tableId: number, call: Call) => async (dispatch: AppDispatch) => {
  dispatch(setCallLink({ call, link: null }));
  db.transaction("rw", [db.links], async () => {
    return db.links.delete([tableId, call]);
  });
}

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

  const onSelectLink = useCallback((link: TableBrief) => {
    dispatch(setLink(tableId, call, link));
  }, [dispatch, tableId, call]);

  const onRemoveLink = useCallback(() => {
    dispatch(removeLink(tableId, call));
  }, [dispatch, tableId, call]);

  return <div className="rounded-md border flex flex-col divide-y overflow-hidden">
    <div className="grow-0 shrink-0 flex flex-row h-16 items-center px-2 gap-2">
      <CircularButton
        className="font-emoji mr-auto"
        disabled={link === null}
        colorScheme={link !== null ? "gray" : "text"}
        onClick={link !== null ? () => dispatch(setActiveTable(link)) : undefined}
      >
        {renderCall(call)}
      </CircularButton>
      {!readOnly &&
        <Popup
          trigger={<CircularButton colorScheme="gray">Link</CircularButton>}
        >
          {((close: () => void) => <TableSelector onSelect={onSelectLink} onClose={close} />) as any}
        </Popup>
      }
      {!readOnly && <CircularButton colorScheme="red" onClick={onRemoveLink}>Del</CircularButton>}
    </div>
    <TextEditor
      className="grow p-3 bg-neutral-100 max-h-64 overflow-y-auto"
      initialValue={meaning ?? emptyRichText}
      onChange={onMeaningChange}
      readOnly={readOnly}
    />
  </div>;
};
