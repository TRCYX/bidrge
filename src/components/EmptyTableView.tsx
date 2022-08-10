import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

export const EmptyTableView: FunctionComponent = () => {
  const { t } = useTranslation();
  return <div className="h-full grid grid-cols-1">
    <div className="mx-6 my-8 border border-amber-500 rounded-lg bg-amber-100 grid grid-cols-1">
      <div className="m-auto flex flex-col gap-4">
        <h1 className="text-center text-9xl text-amber-500">BIDRGE</h1>
        <p className="text-center text-5xl text-amber-500">{t`biddingNotepad`}</p>
      </div>
    </div>
  </div>;
};
