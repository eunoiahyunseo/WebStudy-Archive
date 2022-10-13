import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
// ReactDOM.render(<App page="home" />, document.getElementById("root"));
const initialData = window.__INITIAL_DATA__;
ReactDOM.hydrate(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
