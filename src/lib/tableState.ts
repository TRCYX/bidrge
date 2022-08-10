import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bid, bidRange, Call, compareBids } from "./bridge";
import { RichText } from "./editor";

export type BidInfo = {
  meaning: RichText | null;
  link: number | null;
};

export type TableBrief = {
  id: number;
  title: string;
  firstBid: Bid;
  description: RichText;
};

export type Table = TableBrief & {
  meanings: Partial<Record<Call, RichText>>;
  links: Partial<Record<Call, number>>;
};

export type TableState =
  | {
    state: "empty";
  }
  | ({
    state: "loading";
  } & TableBrief)
  | ({
    state: "ready";
    readOnly: boolean;
  } & Table);

const tableSlice = createSlice({
  name: "table",
  initialState: { state: "empty" } as TableState,
  reducers: {
    setDescription: (state, action: PayloadAction<RichText>) => {
      if (state.state === "ready") {
        state.description = action.payload;
      }
    },
    setCallMeaning: (state, action: PayloadAction<{ call: Call, meaning: RichText | null }>) => {
      if (state.state === "ready") {
        const { call, meaning } = action.payload;
        if (meaning !== null) {
          state.meanings[call] = meaning;
        } else if (call in state.meanings) {
          delete state.meanings[call];
        }
      }
    },
    setCallLink: (state, action: PayloadAction<{ call: Call, link: number | null }>) => {
      if (state.state === "ready") {
        const { call, link } = action.payload;
        if (link !== null) {
          state.links[call] = link;
        } else if (call in state.links) {
          delete state.links[call];
        }
      }
    },
    setFirstBid: (state, action: PayloadAction<Bid>) => {
      if (state.state === "ready") {
        const original = state.firstBid;
        state.firstBid = action.payload;
        if (compareBids(original, action.payload) < 0) {
          for (const bid of bidRange(original, action.payload)) {
            if (bid in state.meanings) {
              delete state.meanings[bid];
            }
            if (bid in state.links) {
              delete state.links[bid];
            }
          }
        }
      }
    },
    setTitle: (state, action: PayloadAction<string>) => {
      if (state.state === "ready") {
        state.title = action.payload;
      }
    },
    setTableEmpty: (state) => {
      return {
        state: "empty",
      };
    },
    setTableLoading: (state, action: PayloadAction<TableBrief>) => {
      return {
        state: "loading",
        ...action.payload,
      };
    },
    setTableReady: (state, action: PayloadAction<Table>) => {
      return {
        state: "ready",
        readOnly: false,
        ...action.payload,
      };
    },
    removedTable: (state, action: PayloadAction<number>) => {
      if (state.state !== "empty") {
        if (state.id === action.payload) {
          return {
            state: "empty",
          };
        } else if (state.state === "ready") {
          Object.entries(state.links)
            .filter(([, v]) => v === action.payload)
            .forEach(([k,]) => delete state.links[k as Call]);
        }
      }
    },
    toggleReadOnly: state => {
      if (state.state === "ready") {
        state.readOnly = !state.readOnly;
      }
    },
  },
});

export const { setDescription, setCallMeaning, setCallLink, setFirstBid, setTitle, setTableEmpty, setTableLoading, setTableReady, removedTable, toggleReadOnly } = tableSlice.actions;

export const tableReducer = tableSlice.reducer;
