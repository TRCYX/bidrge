import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./lib/state";
import { initI18n } from "./lib/i18n";
import { loadNavState } from "./components/BottomBar";
import { EmptyTableView } from "./components/EmptyTableView";
import { TableController } from "./components/TableController";

initI18n();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<EmptyTableView />} />
            <Route path=":tableId" element={<TableController />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  </StrictMode>
);

loadNavState();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
