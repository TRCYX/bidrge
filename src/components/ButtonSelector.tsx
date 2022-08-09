import React, { Key, ReactNode } from "react";
import classNames from "classnames";

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
    {values.map(v => <button
      key={calculateKey(v)}
      className={classNames(
        "rounded-full border w-12 h-12 text-lg active:outline active:outline-amber-500 active:outline-2 active:bg-amber-200",
        { "bg-amber-100 border-amber-500": equal(v, value) }
      )}
      onClick={() => onChange(v)}
    >
      {renderValue(v)}
    </button>
    )}
  </div>;
}
