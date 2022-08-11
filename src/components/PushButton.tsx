import classNames from "classnames";
import React, { FunctionComponent, ReactNode } from "react";
import { ColorSchemes } from "../lib/colorSchemes";

const classes = {
  "amber": "bg-amber-500 hover:bg-amber-400 active:bg-amber-300 disabled:bg-amber-300 text-white",
  "red": "bg-red-500 hover:bg-red-400 active:bg-red-300 disabled:bg-red-300 text-white",
  "gray": "bg-neutral-400 hover:bg-neutral-300 active:bg-neutral-200 disabled:bg-neutral-200 text-white",
};

const loadingInnerClasses = {
  "amber": "border-white",
  "gray": "border-white",
  "red": "border-white",
};

export type PushButtonProps = {
  onClick(): void;
  disabled?: boolean;
  loading?: boolean;
  colorScheme: ColorSchemes;
  className?: string;
  children?: ReactNode | ReactNode[];
};

export const PushButton: FunctionComponent<PushButtonProps> = ({ onClick, disabled, loading, colorScheme, className, children }) => {
  return <button
    className={classNames(
      "rounded-lg w-32 text-lg font-semibold text-center",
      { "py-1.5 px-3": !loading },
      classes[colorScheme],
      className,
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {loading && <>
      <div className="border-4 rounded-full w-6 h-6 m-auto">
        <div className={classNames("m-[-4px] border-t-4 rounded-full w-6 h-6 animate-spin", loadingInnerClasses[colorScheme])} />
      </div>
    </>}
    {!loading && children}
  </button>;
};
