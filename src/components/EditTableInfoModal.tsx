import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bid, compareBids, ExtraTricks, extraTrickValues, getExtraTricks, getSuit, isBid, renderSuit, Suit, suitValues } from "../lib/bridge";
import { db } from "../lib/db";
import { emptyRichText } from "../lib/editor";
import { addedTable, modifiedTable } from "../lib/navState";
import { AppDispatch, useAppDispatch } from "../lib/state";
import { setFirstBid, setTableReady, setTitle, TableBrief } from "../lib/tableState";
import { ButtonSelector } from "./ButtonSelector";
import { Modal } from "./Modal";
import { PushButton } from "./PushButton";

const modifyTable = (id: number, title: string, firstBid: Bid) => async (dispatch: AppDispatch) => {
  await db.transaction("rw", [db.briefs, db.meanings, db.links], async () => {
    await db.briefs.update(id, { title, firstBid });
    await db.meanings.where("tableId").equals(id).filter(x => isBid(x.call) && compareBids(x.call, firstBid) < 0).delete();
    await db.links.where("tableId").equals(id).filter(x => isBid(x.call) && compareBids(x.call, firstBid) < 0).delete();
  });

  dispatch(setTitle(title));
  dispatch(setFirstBid(firstBid));
  dispatch(modifiedTable({ id, title, firstBid }));
};

const createTable = (title: string, firstBid: Bid) => async (dispatch: AppDispatch) => {
  const description = emptyRichText;

  const id = (await db.transaction("rw", [db.briefs], () => {
    return db.briefs.add({ title, firstBid, description });
  })) as number;

  dispatch(setTableReady({ id, title, firstBid, description, meanings: {}, links: {} }));
  dispatch(addedTable({ id, title, firstBid, description }));
}

export type EditTableInfoModalProps = {
  onClose(): void;
} & (Pick<TableBrief, "id" | "title" | "firstBid"> | {
  id?: undefined;
  title?: undefined;
  firstBid?: undefined;
});

export const EditTableInfoModal: FunctionComponent<EditTableInfoModalProps> = ({ onClose, id, title: initialTitle = "", firstBid: initialFirstBid = "1C" }) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState(initialTitle);
  const [firstBidTricks, setFirstBidTricks] = useState<ExtraTricks>(() => getExtraTricks(initialFirstBid));
  const [firstBidSuit, setFirstBidSuit] = useState<Suit>(() => getSuit(initialFirstBid));

  // TODO
  const [working, setWorking] = useState(false);
  const dispatch = useAppDispatch();

  return <Modal
    title={id != null ? t`modifyTableInfo` : t`createTable`}
    actions={
      <>
        <PushButton
          caption={id != null ? t`OK` : t`create`}
          onClick={async () => {
            setWorking(true);
            const firstBid = `${firstBidTricks}${firstBidSuit}` as Bid;
            if (id != null) {
              await dispatch(modifyTable(id, title, firstBid));
            } else {
              await dispatch(createTable(title, firstBid));
            }
            onClose();
          }}
          colorScheme="amber"
          classes="mr-3"
        />
        <PushButton caption={t`cancel`} onClick={onClose} colorScheme="gray" />
      </>
    }
    onClose={onClose}
  >
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 flex flex-col">
        <label className="block mb-1" htmlFor="createTableTitleInput">{t`title`}</label>
        <input
          id="createTabletitleInput"
          className="border rounded-lg px-3 py-1.5"
          value={title}
          onChange={e => setTitle(e.target.value)}
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
  </Modal>;
};
