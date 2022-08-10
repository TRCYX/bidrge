import React, { FunctionComponent } from "react";
import { BidGrid } from "./BidGrid";
import { CallItem } from "./CallItem";
import { setDescription, Table, TableState, toggleReadOnly } from "../lib/tableState";
import { RichText, TextEditor } from "../lib/editor";
import { useAppDispatch, useAppSelector } from "../lib/state";
import { useCallback } from "react";
import { db } from "../lib/db";
import Popup from "reactjs-popup";
import { EditTableInfoModal } from "./EditTableInfoModal";

export type TableViewProps = {
  table: Table;
};

export const TableView: FunctionComponent<TableViewProps> =
  ({ table: { id, title, firstBid, description, meanings, links } }) => {
    const dispatch = useAppDispatch();

    const readOnly = useAppSelector(state => (state.table as TableState & { state: "ready" }).readOnly);

    const onDescriptionChange = useCallback(async (t: RichText) => {
      await db.transaction("rw", [db.briefs], async () => {
        return db.briefs.update(id, { description: t });
      });
      dispatch(setDescription(t));
    }, [dispatch, id]);

    const onToggleReadOnly = useCallback(() => dispatch(toggleReadOnly()), [dispatch]);

    return <div className="mx-6 my-8 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-4">
        <div className="border border-amber-600 rounded-lg bg-amber-600 overflow-hidden">
          <h1 className="text-3xl p-4 text-white whitespace-pre-wrap break-words max-h-80 overflow-y-auto">{title}</h1>
        </div>
        <div className="col-start-2 col-end-4 flex flex-row gap-4 grow-0">
          <div className="flex flex-col items-center gap-4">
            <Popup
              trigger={<button className="rounded-full w-12 h-12 border bg-white">E</button>}
              modal
            >
              {((close: () => void) => <EditTableInfoModal id={id} title={title} firstBid={firstBid} onClose={close} />) as any}
            </Popup>
            <button
              className="rounded-full w-12 h-12 border bg-white"
              onClick={onToggleReadOnly}
            >
              L
            </button>
          </div>
          <div className="border border-amber-500 rounded-lg bg-amber-100 grow overflow-hidden">
            <TextEditor
              className="p-3 min-h-full max-h-80 overflow-y-auto"
              initialValue={description}
              onChange={onDescriptionChange}
              readOnly={readOnly}
            />
          </div>
        </div>
        <CallItem
          call="pass"
          meaning={meanings["pass"] ?? null}
          link={links["pass"] ?? null}
        />
        <CallItem
          call="double"
          meaning={meanings["double"] ?? null}
          link={links["double"] ?? null}
        />
      </div>
      <BidGrid
        firstBid={firstBid}
        meanings={meanings}
        links={links}
      />
    </div>;
  };
