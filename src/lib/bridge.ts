export type Suit = "C" | "D" | "H" | "S" | "NT";

export const suitToInt = {
  "C": 0,
  "D": 1,
  "H": 2,
  "S": 3,
  "NT": 4,
} as const;

export const intToSuit = ["C", "D", "H", "S", "NT"] as const;

export const suitValues: readonly Suit[] = intToSuit;

export const renderSuit = {
  "C": "♣",
  "D": "♦",
  "H": "♥",
  "S": "♠",
  "NT": "NT",
} as const;

export type ExtraTricks = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const extraTrickValues: readonly ExtraTricks[] = [1, 2, 3, 4, 5, 6, 7];

export type Bid = `${ExtraTricks}${Suit}`;

export type Call = Bid | "pass" | "double";

const bids = [
  "1C", "1D", "1H", "1S", "1NT",
  "2C", "2D", "2H", "2S", "2NT",
  "3C", "3D", "3H", "3S", "3NT",
  "4C", "4D", "4H", "4S", "4NT",
  "5C", "5D", "5H", "5S", "5NT",
  "6C", "6D", "6H", "6S", "6NT",
  "7C", "7D", "7H", "7S", "7NT",
  "8C",
] as const;

export function isBid(call: Call): call is Bid {
  return "0" <= call[0] && call[0] <= "9";
}

export function renderCall(call: Call): string {
  if (isBid(call)) {
    return call[0] + renderSuit[call.substring(1) as Suit];
  } else {
    return {
      "pass": "PASS",
      "double": "X",
    }[call];
  }
}

export function compareBids(a: Bid, b: Bid): number {
  return Math.sign(bids.indexOf(a) - bids.indexOf(b));
}

export function bidRange(min: Bid, max: Bid): Bid[] {
  const minIndex = bids.indexOf(min);
  const maxIndex = bids.indexOf(max);
  return Array.from(Array(maxIndex - minIndex).keys()).map(x => bids[x + minIndex]) as Bid[];
}

export const minBid = "1C" as Bid;
export const maxBid = "8C" as Bid;
