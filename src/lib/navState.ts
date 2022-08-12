import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableBrief } from "./tableState";

export type NavState =
  | {
    state: "loading";
  }
  | {
    state: "ready";
    tables: TableBrief[];
  };

const navSlice = createSlice({
  name: "nav",
  initialState: { state: "loading" } as NavState,
  reducers: {
    setNavLoading: state => {
      return {
        state: "loading",
      };
    },
    setNavReady: (state, action: PayloadAction<TableBrief[]>) => {
      return {
        state: "ready",
        tables: action.payload,
      };
    },
    addedTable: (state, action: PayloadAction<TableBrief>) => {
      if (state.state === "ready") {
        state.tables.push(action.payload);
      }
    },
    modifiedTable: (state, action: PayloadAction<Partial<TableBrief> & { id: number }>) => {
      if (state.state === "ready") {
        const index = state.tables.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = {
            ...state.tables[index],
            ...action.payload,
          };
        }
      }
    },
    removedTable: (state, action: PayloadAction<number>) => {
      if (state.state === "ready") {
        const index = state.tables.findIndex(t => t.id === action.payload);
        if (index !== -1) {
          state.tables.splice(index, 1);
        }
      }
    },
  },
});

export const { setNavLoading, setNavReady, addedTable, modifiedTable, removedTable } = navSlice.actions;

export const navReducer = navSlice.reducer;
