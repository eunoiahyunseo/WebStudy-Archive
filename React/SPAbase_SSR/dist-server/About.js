"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const About = () => {
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h3", null, "This is About page"));
};

About.serverFetch = async () => {
  const res = await _axios.default.get("https://hacker-news.firebaseio.com/v0/item/8863.json");
  return {
    routeKey: "about",
    props: {
      data: res.data
    }
  };
};

var _default = About;
exports.default = _default;