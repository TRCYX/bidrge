import { KeyboardEvent } from "react";

const isMac = /mac/i.test(navigator.platform);

export function modKey<E>(event: KeyboardEvent<E>): boolean {
  return isMac ? event.metaKey : event.ctrlKey;
}
