const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  try {
    const data = await axios.get("/data");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  res.send("Hello Express");
});

app.get("/data", (req, res) => {
  res.send("Hello world!");
});

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.listen(3000, () => {
  console.log("3000번 호트에서 대기중");
});
