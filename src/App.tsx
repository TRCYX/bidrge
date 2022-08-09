import React, { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";
import { BottomBar } from "./components/BottomBar";
import { TableBriefView } from "./components/TableBriefView";
import { TableView } from "./components/TableView";
import { useAppSelector } from "./lib/state";

const Table: FunctionComponent = () => {
  const table = useAppSelector(state => state.table);
  if (table.state === "empty") {
    return <div></div>;
  } else if (table.state === "loading") {
    return <TableBriefView
      title={table.title}
      firstBid={table.firstBid}
    />;
  } else {
    return <TableView
      title={table.title}
      firstBid={table.firstBid}
      meanings={table.meanings}
      links={table.links}
    />;
  }
};

const Modals: FunctionComponent = () => {
  return <div></div>;
};

const Page: FunctionComponent = () => {
  return <div>
    <Table />
    <BottomBar />
    <Modals />
  </div>;
};

export const App: FunctionComponent = () => {
  return <Routes>
    <Route path="/" element={<Page />} />
  </Routes>;
};
