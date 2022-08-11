import classNames from "classnames";
import React, { FunctionComponent, ReactNode } from "react";
import { ColorSchemes } from "../lib/colorSchemes";

const classes = {
  "amber": "active:outline-amber-500 active:bg-amber-200 hover:border-amber-500 hover:bg-amber-100",
  "red": "",
  "gray": "active:outline-neutral-400 active:bg-neutral-100 hover:border-neutral-400 bg-neutral-50",
};

const activeClasses = {
  "amber": "bg-amber-100 border-amber-500",
  "red": "",
  "gray": "bg-neutral-50 border-neutral-400",
};

export type CircularButtonProps = {
  onClick(): void;
  active?: boolean;
  colorScheme: ColorSchemes;
  className?: string;
  children?: ReactNode | ReactNode[];
};

export const CircularButton: FunctionComponent<CircularButtonProps> = ({ onClick, active, colorScheme, className, children }) => {
  return <button
    className={classNames(
      "rounded-full border w-12 h-12 text-lg active:outline active:outline-2",
      classes[colorScheme],
      { [activeClasses[colorScheme]]: active },
      className,
    )}
    onClick={onClick}
  >
    {children}
  </button>
};
