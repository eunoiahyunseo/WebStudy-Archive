import axios from "axios";
import React from "react";

const About = () => {
  return (
    <div>
      <h3>This is About page</h3>
    </div>
  );
};

About.serverFetch = async () => {
  const res = await axios.get(
    "https://hacker-news.firebaseio.com/v0/item/8863.json"
  );
  return {
    routeKey: "about",
    props: {
      data: res.data,
    },
  };
};

export default About;
