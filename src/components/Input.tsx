import { useLatest } from "ahooks";
import classNames from "classnames";
import React, { DetailedHTMLProps, FunctionComponent, KeyboardEvent, InputHTMLAttributes, useCallback, ChangeEvent } from "react";
import { renderSuit, Suit } from "../lib/bridge";
import { modKey } from "../lib/keys";
import { MakeRequired } from "../lib/types";

export type InputProps = Omit<MakeRequired<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "value">, "onChange"> & {
  onChange(value: string): void;
};

export const Input: FunctionComponent<InputProps> =
  ({ value, onChange, onKeyDown, className, ...props }) => {
    const latestValue = useLatest(value);
    const keyDownHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
      if (["c", "d", "h", "s"].includes(e.key) && modKey(e) && e.altKey) {
        e.preventDefault();
        onChange(latestValue.current + renderSuit[e.key.toUpperCase() as Suit]);
      } else {
        onKeyDown && onKeyDown(e);
      }
    }, [latestValue, onChange, onKeyDown]);

    const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    }, [onChange]);

    return <input
      value={value}
      onKeyDown={keyDownHandler}
      onChange={changeHandler}
      className={classNames("font-emoji", className)}
      {...props}
    />;
  };