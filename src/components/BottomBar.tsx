import React, { FunctionComponent, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Popup } from "reactjs-popup";
import { useAppSelector } from "../lib/state";
import { shallowEqual } from "react-redux";
import { EditTableInfoModal } from "./EditTableInfoModal";
import { TableSelector } from "./TableSelector";

export const BottomBar: FunctionComponent = () => {
  const { t } = useTranslation();

  const activeTableBrief = useAppSelector(
    state => {
      if (state.table.state !== "empty") {
        const { id, title, firstBid } = state.table;
        return { id, title, firstBid };
      } else {
        return null;
      }
    },
    shallowEqual,
  );

  const navigate = useNavigate();

  return <nav className="w-full bg-amber-500 flex flex-row px-4 py-3 text-lg shadow-[0_-1px_3px_0_rgba(0,0,0,0.1),0_-1px_2px_-1px_rgba(0,0,0,0.1)]">
    <div className="w-56 mx-6 flex flex-row">
      <button
        type="button"
        className="rounded-full py-1.5 px-3 w-12 h-12 bg-white flex justify-center items-center"
        onClick={() => navigate(-1)}
      >
        <span className="font-bold">&lt;</span>
      </button>
      <button
        type="button"
        className="ml-auto rounded-full py-1.5 px-3 w-12 h-12 bg-white flex justify-center items-center"
        onClick={() => navigate(1)}
      >
        <span className="font-bold">&gt;</span>
      </button>
    </div>
    <div className="ml-4 w-96">
      <div className="w-full h-full rounded-lg bg-white flex flex-row divide-x">
        <div className="py-1.5 px-3 my-auto rounded-l-lg grow shrink min-w-0 truncate">{activeTableBrief?.title}</div>
        <Popup
          position="top right"
          arrow={false}
          trigger={<button type="button" className="py-1.5 px-3 rounded-r-lg flex items-center">^</button>}
          nested
        >
          <TableSelector />
        </Popup>
      </div>
    </div>
    <div className="ml-4">
      <Popup
        trigger={<button type="button" className="rounded-full py-1.5 px-3 w-12 h-12 bg-white flex justify-center items-center">
          <span className="font-bold">+</span>
        </button>}
        modal
        lockScroll
      >
        {
          ((close: () => void) => <EditTableInfoModal onClose={close} />) as any
        }
      </Popup>
    </div>
    <div className="ml-auto rounded-lg py-1.5 px-3 w-40 bg-white flex justify-center items-center">
      <div className="font-bold text-lg">{t`save...`}</div>
    </div>
    <div className="ml-4 rounded-lg py-1.5 px-3 w-40 bg-white flex justify-center items-center">
      <div className="font-bold text-lg">{t`load...`}</div>
    </div>
  </nav>;
};
