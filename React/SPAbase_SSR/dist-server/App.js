"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Home = _interopRequireDefault(require("./Home"));

var _About = _interopRequireDefault(require("./About"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Container = _styledComponents.default.div.withConfig({
  displayName: "App__Container",
  componentId: "sc-13ulhvq-0"
})(["background-color:#aaaaaa;border:1px solid blue;"]);

const routes = [{
  key: "home",
  path: "/",
  element: _Home.default
}, {
  key: "about",
  path: "/about",
  element: _About.default
}]; // function App({ page: initialPage }) {
//   const [page, setPage] = useState(initialPage);
//   useEffect(() => {
//     window.onpopstate = (event) => {
//       setPage(event.state);
//     };
//   }, []);
//   function onChangePage(e) {
//     const newPage = e.target.dataset.page;
//     window.history.pushState(newPage, "", `/${newPage}`);
//     setPage(newPage);
//   }
//   const PageComponent = page === "home" ? Home : About;
//   return (
//     <Container>
//       <button data-page="home" onClick={onChangePage}>
//         Home
//       </button>
//       <button data-page="about" onClick={onChangePage}>
//         About
//       </button>
//       <PageComponent />
//     </Container>
//   );
// }

exports.routes = routes;

const App = () => {
  return /*#__PURE__*/_react.default.createElement(Container, null, /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/"
  }, "Home")), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/about"
  }, "About"))), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Routes, null, routes.map(route => /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, _extends({
    key: route.key
  }, route)))));
};

var _default = App;
exports.default = _default;