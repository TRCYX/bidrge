import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bid, compareBids, ExtraTricks, extraTrickValues, getExtraTricks, getSuit, isBid, renderSuit, Suit, suitValues } from "../lib/bridge";
import { db, DBTableBrief } from "../lib/db";
import { emptyRichText } from "../lib/editor";
import { addedTable, modifiedTable } from "../lib/navState";
import { AppDispatch, useAppDispatch } from "../lib/state";
import { setFirstBid, setTableReady, setTitle, TableBrief } from "../lib/tableState";
import { ButtonSelector } from "./ButtonSelector";
import { Input } from "./Input";
import { Modal, ModalActions, ModalBody } from "./Modal";
import { PushButton } from "./PushButton";

const modifyTable = (id: number, title: string, firstBid: Bid) => async (dispatch: AppDispatch) => {
  await db.transaction("rw", [db.briefs, db.meanings, db.links], async () => {
    return Promise.all([
      db.briefs.update(id, { title, firstBid }),
      db.meanings.where("tableId").equals(id).filter(x => isBid(x.call) && compareBids(x.call, firstBid) < 0).delete(),
      db.links.where("tableId").equals(id).filter(x => isBid(x.call) && compareBids(x.call, firstBid) < 0).delete(),
    ]);
  });

  dispatch(setTitle(title));
  dispatch(setFirstBid(firstBid));
  dispatch(modifiedTable({ id, title, firstBid }));
};

const createTable = (title: string, firstBid: Bid) => async (dispatch: AppDispatch) => {
  const description = emptyRichText;

  const id = (await db.transaction("rw", [db.briefs], () => {
    return db.briefs.add({ title, firstBid, description } as DBTableBrief);
  })) as number;

  dispatch(setTableReady({ id, title, firstBid, description, meanings: {}, links: {} }));
  dispatch(addedTable({ id, title, firstBid }));
}

export type EditTableInfoModalProps = {
  open: boolean;
  nested?: boolean;
  onClose(): void;
} & (Pick<TableBrief, "id" | "title" | "firstBid"> | {
  id?: undefined;
  title?: undefined;
  firstBid?: undefined;
});

export const EditTableInfoModal: FunctionComponent<EditTableInfoModalProps> = ({ open, nested, onClose, id, title: initialTitle = "", firstBid: initialFirstBid = "1C" }) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState(initialTitle);
  const [firstBidTricks, setFirstBidTricks] = useState<ExtraTricks>(() => getExtraTricks(initialFirstBid));
  const [firstBidSuit, setFirstBidSuit] = useState<Suit>(() => getSuit(initialFirstBid));

  const [working, setWorking] = useState(false);
  const dispatch = useAppDispatch();

  return <Modal
    open={open}
    nested={nested}
    working={working}
    title={id != null ? t`modifyTableInfo` : t`createTable`}
    onClose={onClose}
  >
    <ModalBody>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col">
          <label className="block mb-1" htmlFor="createTableTitleInput">{t`title`}</label>
          <Input
            id="createTabletitleInput"
            className="border rounded-lg px-3 py-1.5"
            value={title}
            onChange={setTitle}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="block mb-1">{t`minTricks`}</label>
          <ButtonSelector<ExtraTricks>
            values={extraTrickValues}
            value={firstBidTricks}
            onChange={setFirstBidTricks}
            calculateKey={v => v}
          />
        </div>
        <div className="flex flex-col flex-1 ml-4">
          <label className="block mb-1">{t`minSuit`}</label>
          <ButtonSelector<Suit>
            values={suitValues}
            value={firstBidSuit}
            onChange={setFirstBidSuit}
            renderValue={v => <span className="font-emoji">{renderSuit[v]}</span>}
            calculateKey={v => v}
          />
        </div>
      </div>
    </ModalBody>
    <ModalActions>
      <PushButton
        onClick={async () => {
          setWorking(true);
          const firstBid = `${firstBidTricks}${firstBidSuit}` as Bid;
          if (id != null) {
            await dispatch(modifyTable(id, title, firstBid));
          } else {
            await dispatch(createTable(title, firstBid));
          }
          setWorking(false);
          onClose();
        }}
        disabled={working}
        loading={working}
        colorScheme="amber"
        className="mr-3"
      >
        {id != null ? t`OK` : t`create`}
      </PushButton>
      <PushButton
        onClick={onClose}
        disabled={working}
        colorScheme="gray"
      >
        {t`cancel`}
      </PushButton>
    </ModalActions>
  </Modal>;
};
