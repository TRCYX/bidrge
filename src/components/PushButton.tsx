import classNames from "classnames";
import React, { FunctionComponent } from "react";

export const pushButtonColorSchemes = {
  "amber": "bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-white",
  "red": "bg-red-500 hover:bg-red-400 active:bg-red-300 text-white",
  "gray": "bg-neutral-400 hover:bg-neutral-300 active:bg-neutral-200 text-white",
};

export type PushButtonProps = {
  onClick(): void;
  caption: string;
  colorScheme: keyof typeof pushButtonColorSchemes;
  classes?: string;
};

export const PushButton: FunctionComponent<PushButtonProps> = ({ onClick, caption, colorScheme, classes = "" }) => {
  return <button
    className={classNames("mr-3 py-1.5 px-3 rounded-lg w-32 text-lg font-semibold text-center", classes, pushButtonColorSchemes[colorScheme])}
    onClick={onClick}
  >
    {caption}
  </button>;
};
