import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../lib/db";
import { removedTable as removedTableNav } from "../lib/navState";
import { AppDispatch, useAppDispatch } from "../lib/state";
import { removedTable as removedTableTable, TableBrief } from "../lib/tableState";
import { Modal, ModalActions, ModalBody } from "./Modal";
import { PushButton } from "./PushButton";

const removeTable = (table: TableBrief) => async (dispatch: AppDispatch) => {
  await db.transaction("rw", [db.briefs, db.meanings, db.links], async () => {
    return Promise.all([
      db.briefs.delete(table.id),
      db.meanings.where("tableId").equals(table.id).delete(),
      db.links.where("tableId").equals(table.id).or("link").equals(table.id).delete(),
    ]);
  });
  dispatch(removedTableNav(table.id));
  dispatch(removedTableTable(table.id));
};

export type DeleteTableModalProps = {
  open: boolean;
  nested?: boolean;
  table: TableBrief;
  onClose(): void;
};

export const DeleteTableModal: FunctionComponent<DeleteTableModalProps> = ({ open, nested, table, onClose }) => {
  const { t } = useTranslation();

  const [working, setWorking] = useState(false);
  const dispatch = useAppDispatch();

  return <Modal
    open={open}
    nested={nested}
    working={working}
    title={t`removeTable`}
    onClose={onClose}
  >
    <ModalBody>
      {t("certainToRemoveTable", { title: table.title })}
    </ModalBody>
    <ModalActions>
      <PushButton
        onClick={async () => {
          setWorking(true);
          await dispatch(removeTable(table));
          setWorking(false);
          onClose();
        }}
        disabled={working}
        loading={working}
        colorScheme="red"
        className="mr-3"
      >
        {t`remove`}
      </PushButton>
      <PushButton
        disabled={working}
        onClick={onClose}
        colorScheme="gray"
      >
        {t`cancel`}
      </PushButton>
    </ModalActions>
  </Modal>;
};
