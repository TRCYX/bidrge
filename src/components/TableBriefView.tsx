import React, { FunctionComponent } from "react";
import { Bid } from "../lib/bridge";

export type TableBriefViewProps = {
  title: string;
  firstBid: Bid;
};

export const TableBriefView: FunctionComponent<TableBriefViewProps> =
  ({ title, firstBid }) => {
    return <div>{ /* TODO */}</div>;
  };
