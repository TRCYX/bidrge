import React, { FunctionComponent, ReactNode } from "react";

export type ModalProps = {
  title: string;
  actions: ReactNode;
  onClose(): void;
  children: ReactNode | ReactNode[];
};

export const Modal: FunctionComponent<ModalProps> = ({ title, actions, onClose, children }) => {
  return <div className="w-160 rounded-lg bg-white mb-[4.5rem] flex flex-col divide-y">
    <div className="py-3 px-4">
      <button className="float-right text-2xl font-semibold leading-none rotate-45 text-neutral-500 hover:text-neutral-400" onClick={onClose}>+</button>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <div className="py-3 px-4 min-h-[10rem]">{children}</div>
    <div className="py-3 px-4 flex flex-row justify-end">{actions}</div>
  </div>
};
