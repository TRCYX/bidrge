import React, { Key, ReactNode } from "react";
import { CircularButton } from "./CircularButton";

export type ButtonSelectorProps<T> = {
  values: readonly T[];
  value: T;
  renderValue?(a: T): ReactNode;
  equal?(a: T, b: T): boolean;
  onChange(newValue: T): void;
  calculateKey(a: T): Key;
};

export function ButtonSelector<T>({
  values, value, renderValue = x => `${x}`, equal = (a, b) => a === b, onChange = () => { }, calculateKey
}: ButtonSelectorProps<T>) {
  return <div className="flex flex-row gap-4 flex-wrap">
    {values.map(v =>
      <CircularButton
        key={calculateKey(v)}
        active={equal(v, value)}
        colorScheme="amber"
        onClick={() => onChange(v)}
      >
        {renderValue(v)}
      </CircularButton>
    )}
  </div>;
}
