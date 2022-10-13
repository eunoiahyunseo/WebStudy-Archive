"use strict";

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _server = require("react-dom/server");

var _react = _interopRequireDefault(require("react"));

var _App = _interopRequireWildcard(require("./App"));

var _styledComponents = require("styled-components");

var _reactRouter = require("react-router");

var _server2 = require("react-router-dom/server");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

const html = _fs.default.readFileSync(_path.default.resolve(__dirname, "..", "./dist/index.html"), "utf8");

app.use("/dist", _express.default.static(_path.default.resolve(__dirname, "../dist")));
app.set("PORT", 3000);
app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.get("*", async (req, res) => {
  console.log(req.url); // const requiredServerFetch = routes
  //   .filter((route) => matchPath(req.url, route.path))
  //   .map((route) => route.element)
  //   .filter((component) => component.serverFetch)
  //   .map((component) => component.serverFetch);
  // console.log(requiredServerFetch);
  // const data = await Promise.all(requiredServerFetch.map((fetchFn) => fetchFn()));

  const store = {// data,
  };
  const sheet = new _styledComponents.ServerStyleSheet();
  const renderString = (0, _server.renderToString)(sheet.collectStyles( /*#__PURE__*/_react.default.createElement(_server2.StaticRouter, {
    location: req.url,
    context: {}
  }, /*#__PURE__*/_react.default.createElement(_App.default, null))));
  const styles = sheet.getStyleTags(); // const initialData = { page };

  const result = html.replace('<div id="root"></div>', `<div id="root">${renderString}</div>`).replace("__DATA_FROM_SERVER__", JSON.stringify(store)).replace("__STYLE_FROM_SERVER__", styles);
  res.send(result);
});
app.listen(app.get("PORT"), () => {
  console.log(`${app.get("PORT")} 포트에서 서버가 대기중입니다.`);
});