import React, { FunctionComponent } from "react";
import { TableBrief } from "../lib/tableState";

export type TableBriefViewProps = {
  table: TableBrief;
};

export const TableBriefView: FunctionComponent<TableBriefViewProps> =
  ({ table: { title, firstBid } }) => {
    return <div>{ /* TODO */}</div>;
  };
