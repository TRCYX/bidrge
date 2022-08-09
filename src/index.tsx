import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./lib/state";
import { initI18n } from "./lib/i18n";
import { db } from "./lib/db";
import { setNavReady } from "./lib/navState";
import { TableBrief } from "./lib/tableState";

initI18n();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

db.transaction("r", [db.briefs], () => {
  return db.briefs.orderBy("id").toArray();
}).then(briefs => {
  store.dispatch(setNavReady(briefs as TableBrief[]));
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
