import React, { FunctionComponent, ReactNode } from "react";
import Popup from "reactjs-popup";

export type ModalBodyProps = {
  children: ReactNode | ReactNode[];
};

export const ModalBody: FunctionComponent<ModalBodyProps> = ({ children }) => {
  return <div className="py-3 px-4 min-h-[10rem]">{children}</div>;
};

export type ModalActionsProps = {
  children: ReactNode | ReactNode[];
};

export const ModalActions: FunctionComponent<ModalActionsProps> = ({ children }) => {
  return <div className="py-3 px-4 flex flex-row justify-end">{children}</div>;
};

export type ModalProps = {
  open: boolean;
  nested?: boolean;
  title: string;
  onClose(): void;
  working?: boolean;
  children: ReactNode | ReactNode[];
};

export const Modal: FunctionComponent<ModalProps> = ({ open, nested, title, onClose, working, children }) => {
  return (
    <Popup
      open={open}
      nested={nested}
      closeOnDocumentClick={!working}
      closeOnEscape={!working}
      onClose={onClose}
      modal
      lockScroll
    >
      <div className="w-160 rounded-lg bg-white mb-[4.5rem] flex flex-col divide-y">
        <div className="py-3 px-4">
          <button
            className="float-right text-2xl font-semibold leading-none rotate-45 text-neutral-500 hover:text-neutral-400 active:text-neutral-300 disabled:text-neutral-300"
            onClick={onClose}
            disabled={working}
          >
            +
          </button>
          <h3 className="text-xl font-semibold">{title}</h3>
          {children}
        </div>
      </div>
    </Popup>);
};
