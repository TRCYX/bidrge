import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bid, minBid } from "./bridge";

export type ModalState =
  | {
    state: "ready",
  }
  | {
    state: "addTable",
    title: string,
    firstBid: Bid,
    working: boolean;
  }
  | {
    state: "removeTable",
    id: number,
  };

const modalSlice = createSlice({
  name: "modal",
  initialState: { state: "ready" } as ModalState,
  reducers: {
    startAddTable: state => {
      if (state.state === "ready") {
        return {
          state: "addTable",
          title: "",
          firstBid: minBid,
          working: false,
        };
      }
    },
    doAddTable: state => {
      if (state.state === "addTable") {
        state.working = true;
      }
    },
    finishAddTable: state => {
      if (state.state === "addTable") {
        return { state: "ready" };
      }
    },
    startRemoveTable: (state, action: PayloadAction<number>) => {
      if (state.state === "ready") {
        return {
          state: "removeTable",
          id: action.payload,
        };
      }
    },
    finishRemoveTable: state => {
      if (state.state === "removeTable") {
        return { state: "ready" };
      }
    },
  },
});

export const { startAddTable, doAddTable, startRemoveTable } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
