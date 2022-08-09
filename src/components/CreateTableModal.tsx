import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bid, ExtraTricks, extraTrickValues, renderSuit, Suit, suitValues } from "../lib/bridge";
import { db } from "../lib/db";
import { addedTable } from "../lib/navState";
import { AppDispatch, useAppDispatch } from "../lib/state";
import { setTableReady } from "../lib/tableState";
import { ButtonSelector } from "./ButtonSelector";
import { Modal } from "./Modal";
import { PushButton } from "./PushButton";

const createTable = (title: string, firstBid: Bid) => async (dispatch: AppDispatch) => {
  const id = (await db.transaction("rw", [db.briefs], () => {
    return db.briefs.add({ title, firstBid });
  })) as number;

  dispatch(setTableReady({ id, title, firstBid, meanings: {}, links: {} }));
  dispatch(addedTable({ id, title, firstBid }));
}

export type CreateTableModalProps = {
  onClose(): void;
};

export const CreateTableModal: FunctionComponent<CreateTableModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [firstBidTricks, setFirstBidTricks] = useState<ExtraTricks>(1);
  const [firstBidSuit, setFirstBidSuit] = useState<Suit>("C");

  // TODO
  const [working, setWorking] = useState(false);
  const dispatch = useAppDispatch();

  return <Modal
    title={t`createTable`}
    actions={
      <>
        <PushButton
          caption={t`create`}
          onClick={async () => {
            setWorking(true);
            await dispatch(createTable(title, `${firstBidTricks}${firstBidSuit}` as Bid));
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
          className="border rounded-lg px-3 py-1.5 w-full"
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
        <label className="block mb-1" htmlFor="createTableTitleInput">{t`minSuit`}</label>
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
