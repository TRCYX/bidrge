import React, { FunctionComponent, useMemo } from "react";
import { Bid, bidRange, maxBid } from "../lib/bridge";
import { RichText } from "../lib/editor";
import { IllegalCallItem, CallItem } from "./CallItem";

export type BidGridProps = {
  firstBid: Bid;
  meanings: Partial<Record<Bid, RichText>>;
  links: Partial<Record<Bid, number>>;
};

export const BidGrid: FunctionComponent<BidGridProps> = ({ firstBid, meanings, links }) => {
  const illegalBids = useMemo(
    () => bidRange((firstBid[0] + "C") as Bid, firstBid),
    [firstBid],
  );
  const responseBids = useMemo(
    () => bidRange(firstBid, maxBid),
    [firstBid],
  );

  return <div className="grid grid-cols-5 gap-4 m-2 bidgrid">
    {illegalBids.map(b => <IllegalCallItem key={b} />)}
    {responseBids.map(b =>
      <CallItem
        key={b}
        call={b}
        meaning={meanings[b] ?? null}
        link={links[b] ?? null}
      />
    )}
  </div>;
};
