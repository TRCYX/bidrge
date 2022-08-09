import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { modalReducer } from "./modalState";
import { navReducer } from "./navState";
import { tableReducer } from "./tableState";


export const store = configureStore({
  reducer: {
    table: tableReducer,
    nav: navReducer,
    modal: modalReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
