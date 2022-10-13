/* cookie/cookie.js */

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const path = require("path");
const { authUtil } = require("./middlewares/auth.js");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser("COOKIE-SECRET"));

app.use(
  session({
    secret: "COOKIE-SECRET",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.use(
  "/css",
  express.static(path.resolve(__dirname, "./css"))
);

app.set("view engine", "ejs");
app.set("views", "views");

app.set("PORT", 3000);

// verify token
app.use(authUtil);

let user = {
  id: "123",
  password: "123",
  nick: "hyunseo",
};

app.get("/", (req, res) => {
  if (req.session.logined) {
    res.status(200).render("logout", {
      data: {
        token: req.session.jwtToken,
        id: req.decoded.id,
        nick: req.decoded.nick,
      },
    });
  } else {
    res.status(200).render("login");
  }
});

app.post("/", async (req, res) => {
  if (
    user.id === req.body.id &&
    user.password === req.body.pwd
  ) {
    req.session.logined = true;

    /**
     * @property {String} userId
     * @property {String} secretKey
     */
    const postData = {
      userId: req.body.id,
      secretKey: process.env.JWT_SECRET_KEY,
      nick: user.nick,
    };

    try {
      const {
        data: { token },
      } = await axios.post(
        "http://localhost:3008/sign",
        postData,
        {}
      );
      req.session.jwtToken = token;
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.error(error.message);
    }
  } else {
    res.send(`<h1>Who are you?</h1> <a href="/">Back</a>`);
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.use((req, res, next) => {
  const error = new Erorr(
    `${req.method} ${req.url}라우터가 없습니다.`
  );
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.send(err.message);
});

app.listen(app.get("PORT"), () => {
  console.log(`*:: listening at ${app.get("PORT")}`);
});
