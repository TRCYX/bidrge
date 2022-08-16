import React, { FunctionComponent, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Call } from "../lib/bridge";
import { db } from "../lib/db";
import { RichText } from "../lib/editor";
import { store, useAppDispatch, useAppSelector } from "../lib/state";
import { setTableEmpty, setTableReady, TableBrief } from "../lib/tableState";
import { TableBriefView } from "./TableBriefView";
import { TableView } from "./TableView";

export const TableController: FunctionComponent = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const table = useAppSelector(state => state.table);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!tableId) {
      navigate("/");
      return;
    }
    const id = parseInt(tableId, 10);
    if (isNaN(id)) {
      navigate("/");
      return;
    }

    const table = store.getState().table;
    if (table.state !== "empty" && table.id !== id) {
      dispatch(setTableEmpty());
    }

    (async () => {
      const table = await db.transaction("r", [db.briefs, db.meanings, db.links], async () => {
        const brief = await db.briefs.get(id);
        if (!brief) {
          return null;
        }

        const meanings: Partial<Record<Call, RichText>> = {};
        const meaningsPromise = db.meanings.where("tableId").equals(id).each(m => {
          meanings[m.call] = m.meaning;
        });

        const links: Partial<Record<Call, TableBrief>> = {};
        const linksPromise = (async () => {
          const linkArr = await db.links.where("tableId").equals(id).toArray();
          const briefArr = await Promise.all(linkArr.map(l => db.briefs.get(l.link)));
          for (let i = 0; i < linkArr.length; ++i) {
            const { id, title, firstBid } = briefArr[i]!;
            links[linkArr[i].call] = { id, title, firstBid };
          }
        })();

        await Promise.all([meaningsPromise, linksPromise,]);

        return {
          ...brief,
          meanings,
          links,
        };
      });

      if (!table) {
        navigate("/");
      } else {
        dispatch(setTableReady(table));
      }
    })();
  }, [tableId, navigate, dispatch, location]);

  if (table.state !== "ready") {
    return <TableBriefView />;
  } else {
    return <TableView key={table.id} table={table} />;
  }
};
