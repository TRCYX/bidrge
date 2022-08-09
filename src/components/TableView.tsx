import React, { FunctionComponent } from "react";
import { BidGrid } from "./BidGrid";
import { Bid, Call } from "../lib/bridge";
import { CallItem } from "./CallItem";
import { RichText } from "../lib/editor";

export type TableViewProps = {
  title: string;
  firstBid: Bid;
  meanings: Partial<Record<Call, RichText>>;
  links: Partial<Record<Call, number>>;
};

export const TableView: FunctionComponent<TableViewProps> =
  ({ title, firstBid, meanings, links }) => {
    return <div className="mx-4 my-8 flex flex-row">
      <div className="flex-grow flex-shrink basis-1/6 flex flex-col m-2 gap-4">
        <h1 className="text-3xl">{title}</h1>
        <CallItem
          call="pass"
          meaning={meanings["pass"] ?? null}
          link={links["pass"] ?? null}
        />
        <CallItem
          call="double"
          meaning={meanings["double"] ?? null}
          link={links["double"] ?? null}
        />
      </div>
      <div className="flex-grow flex-shrink basis-5/6">
        <BidGrid
          firstBid={firstBid}
          meanings={meanings}
          links={links}
        />
      </div>
    </div>;
  };
