import { useTitle } from "ahooks";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { BottomBar } from "./components/BottomBar";

export const App: FunctionComponent = () => {
  const { t } = useTranslation();
  useTitle("BIDRGE - " + t`biddingNotepad`);
  return <div className="w-screen w-[100dvw] h-screen h-[100dvh] flex flex-col">
    <main className="grow overflow-y-auto">
      <Outlet />
    </main>
    <BottomBar />
  </div>;
};
