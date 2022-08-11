import classNames from "classnames";
import React, { DetailedHTMLProps, FunctionComponent, ReactNode } from "react";
import { forwardRef } from "react";
import { ColorSchemes } from "../lib/colorSchemes";

const classes = {
  "amber": "active:outline-amber-500 active:bg-amber-200 hover:border-amber-500 hover:bg-amber-100",
  "red": "",
  "gray": "active:outline-neutral-500 active:bg-neutral-200 hover:border-neutral-500 hover:bg-neutral-100",
  "text": "border-transparent",
};

const activeClasses = {
  "amber": "bg-amber-100 border-amber-500",
  "red": "",
  "gray": "bg-neutral-100 border-neutral-500",
  "text": "",
};

export type CircularButtonProps = {
  active?: boolean;
  colorScheme: ColorSchemes;
  children?: ReactNode | ReactNode[];
} & Omit<DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "children">;

export const CircularButton = forwardRef<HTMLButtonElement, CircularButtonProps>(({ active, colorScheme, className, children, ...props }, ref) => {
  return <button
    ref={ref}
    className={classNames(
      "rounded-full border w-12 h-12 text-lg active:outline active:outline-2",
      classes[colorScheme],
      { [activeClasses[colorScheme]]: active },
      className,
    )}
    {...props}
  >
    {children}
  </button>;
});
