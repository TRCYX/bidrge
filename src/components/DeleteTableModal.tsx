import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../lib/db";
import { removedTable as removedTableNav } from "../lib/navState";
import { AppDispatch, AppState, useAppDispatch } from "../lib/state";
import { removedTable as removedTableTable, TableBrief } from "../lib/tableState";
import { Modal } from "./Modal";
import { PushButton } from "./PushButton";

const removeTable = (table: TableBrief) => async (dispatch: AppDispatch, getState: () => AppState) => {
  await db.transaction("rw", [db.briefs, db.meanings, db.links], async () => {
    db.briefs.delete(table.id);
    db.meanings.where("tableId").equals(table.id).delete();
    db.links.where("tableId").equals(table.id).delete();
  });
  dispatch(removedTableNav(table.id));
  dispatch(removedTableTable(table.id));
};

export type DeleteTableModalProps = {
  table: TableBrief;
  onClose(): void;
};

export const DeleteTableModal: FunctionComponent<DeleteTableModalProps> = ({ table, onClose }) => {
  const { t } = useTranslation();

  // TODO
  const [working, setWorking] = useState(false);
  const dispatch = useAppDispatch();

  return <Modal
    title={t`removeTable`}
    actions={
      <>
        <PushButton
          caption={t`remove`}
          onClick={async () => {
            setWorking(true);
            await dispatch(removeTable(table));
            onClose();
          }}
          colorScheme="red"
          classes="mr-3"
        />
        <PushButton caption={t`cancel`} onClick={onClose} colorScheme="gray" />
      </>
    }
    onClose={onClose}
  >
    {t("certainToRemoveTable", { title: table.title })}
  </Modal>;
};
