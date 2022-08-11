import classNames from "classnames";
import React, { DetailedHTMLProps, FunctionComponent, ReactNode } from "react";
import { ColorSchemes } from "../lib/colorSchemes";

const classes = {
  "amber": "bg-amber-500 hover:bg-amber-400 active:bg-amber-300 disabled:bg-amber-300 text-white",
  "red": "bg-red-500 hover:bg-red-400 active:bg-red-300 disabled:bg-red-300 text-white",
  "gray": "bg-neutral-400 hover:bg-neutral-300 active:bg-neutral-200 disabled:bg-neutral-200 text-white",
  "text": "",
};

const loadingInnerClasses = {
  "amber": "border-white",
  "gray": "border-white",
  "red": "border-white",
  "text": "",
};

export type PushButtonProps = {
  loading?: boolean;
  colorScheme: ColorSchemes;
  children?: ReactNode | ReactNode[];
} & Omit<DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "children">;

export const PushButton: FunctionComponent<PushButtonProps> = ({ loading, colorScheme, className, children, ...props }) => {
  return <button
    className={classNames(
      "rounded-lg w-32 text-lg font-semibold text-center",
      { "py-1.5 px-3": !loading },
      classes[colorScheme],
      className,
    )}
    {...props}
  >
    {loading && <>
      <div className="border-4 rounded-full w-6 h-6 m-auto">
        <div className={classNames("m-[-4px] border-t-4 rounded-full w-6 h-6 animate-spin", loadingInnerClasses[colorScheme])} />
      </div>
    </>}
    {!loading && children}
  </button>;
};
