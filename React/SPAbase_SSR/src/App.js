import React, { useState, useEffect } from "react";
import Home from "./Home";
import About from "./About";
import styled from "styled-components";
import { Link, Routes, Route } from "react-router-dom";

const Container = styled.div`
  background-color: #aaaaaa;
  border: 1px solid blue;
`;

export const routes = [
  {
    key: "home",
    path: "/",
    element: Home,
  },
  {
    key: "about",
    path: "/about",
    element: About,
  },
];

// function App({ page: initialPage }) {
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

const App = () => {
  return (
    <Container>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <Routes>
        {routes.map((route) => (
          <Route key={route.key} {...route} />
        ))}
      </Routes>
    </Container>
  );
};

export default App;
