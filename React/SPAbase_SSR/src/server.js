import express from "express";
import fs from "fs";
import path from "path";
import { renderToString } from "react-dom/server";
import React from "react";
import App, { routes } from "./App";
import { ServerStyleSheet } from "styled-components";
import { StaticRouter, matchPath } from "react-router-dom";
import PreloadContext from "./lib/PreloadContext";

const app = express();
const html = fs.readFileSync(path.resolve(__dirname, "../dist/index.html"), "utf-8");
app.use("/dist", express.static("dist"));
app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.get("*", async (req, res) => {
  const requiredServerFetch = routes
    .filter((route) => matchPath(req.url, route))
    .map((route) => route.component)
    .filter((component) => component.serverFetch)
    .map((component) => component.serverFetch);
  const data = await Promise.all(requiredServerFetch.map((fetch) => fetch()));
  const store = {
    data,
  };

  const sheet = new ServerStyleSheet();
  const renderString = renderToString(
    sheet.collectStyles(
      <StaticRouter location={req.url} context={{}}>
        <PreloadContext.Provider value={store}>
          {" "}
          // (1)
          <App />
        </PreloadContext.Provider>
      </StaticRouter>
    )
  );
  const styles = sheet.getStyleTags();
  const result = html
    .replace('<div id="root"></div>', `<div id="root">${renderString}</div>`)
    .replace("__DATA_FROM_SERVER__", JSON.stringify(store))
    .replace("__STYLE_FROM_SERVER__", styles);
  res.send(result);
});
app.listen(3000);
