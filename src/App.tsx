import { useTitle } from "ahooks";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { BottomBar } from "./components/BottomBar";
import { EmptyTableView } from "./components/EmptyTableView";
import { TableBriefView } from "./components/TableBriefView";
import { TableView } from "./components/TableView";
import { useAppSelector } from "./lib/state";

const Table: FunctionComponent = () => {
  const table = useAppSelector(state => state.table);
  if (table.state === "empty") {
    return <EmptyTableView />;
  } else if (table.state === "loading") {
    return <TableBriefView key={table.id} id={table.id} />;
  } else {
    return <TableView key={table.id} table={table} />;
  }
};

const Page: FunctionComponent = () => {
  return <div className="w-screen h-screen flex flex-col">
    <div className="grow overflow-y-auto">
      <Table />
    </div>
    <BottomBar />
  </div>;
};

export const App: FunctionComponent = () => {
  const {t} = useTranslation();
  useTitle("BRIDGE - " + t`biddingNotepad`);
  return <Routes>
    <Route path="/" element={<Page />} />
  </Routes>;
};
