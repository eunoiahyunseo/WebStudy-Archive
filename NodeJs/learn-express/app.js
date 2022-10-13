const express = require("express");
const axios = require("axios").default;

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

const nunjucks = require("nunjucks");

// dotenv.config();

const app = express();

// app.set(키, 값)이 형태로 데이터를 저장할 수 있다.
app.set("port", process.env.PORT || 3000);

// app.use(morgan("dev"));

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log("모든 요청에 다 실행됩니다.");
//   next();
// });

// app.get("/", (req, res, next) => {
//   console.log("GET / 요청에서만 실행됩니다.");
//   next();
// });

// app.post("/", (req, res, next) => {
//   //   console.log(req.body);
//   res.cookie("namne", "hyunseo", {
//     expires: new Date(Date.now() + 900000),
//     httpOnly: true,
//     secure: true,
//   });
//   next();
// });
// const birds = require("./routes/birds");

// const indexRouter = require("./routes");
// const userRouter = require("./routes/user");

// app.get("/", (req, res, next) => {
//   res.send("GET request to the hompage");
//   console.log("doing get");
//   // console.log(req.body);
//   next();
// });

// app.post("/", (req, res) => {
//   res.send("POST request to the hompage");
// });

// app.use("/", indexRouter);
// app.use("/user", userRouter);
// app.use("/birds", birds);
// app.use("/user/:id", (req, res) => {
//   console.log(req.params, req.query);
// });

// app
//   .route("/abc")
//   .get((req, res) => {
//     res.send("GET /abc");
//   })
//   .post((req, res) => {
//     res.send("POST /abc");
//   });

// app
//   .route("/data")
//   .get((req, res) => {
//     console.log("get json data");
//     res.send("GET /data");
//   })
//   .post((req, res) => {
//     console.log(req.body);
//     if (req.body) {
//       console.log(req.body);
//     }
//     res.send("POST /data");
//   });

// app.post("/data", (req, res) => {
//   // console.log("doing");
//   res.send(JSON.stringify(req.body));
// });

let user = [
  {
    name: "hyunseo",
    age: 20,
  },
  {
    name: "hyunseo2",
    age: 21,
  },
];

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");
app.set("view engine", "njk");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.get("/", async (req, res) => {
  res.redirect(path.resolve(__dirname, "/static/index.html"));
});

app.get("/user", (req, res) => {
  res.send(user);
});

app.post("/user", (req, res) => {
  const data = req.body;
  user = [...user, ...[data]];
  res.redirect(path.resolve(__dirname, "/static/index.html"));
});

app.get("/pug", (req, res) => {
  res.render("index", { title: "Express" });
});

app.get("/nunjunks", (req, res) => {
  res.render("index", { title: "Nunjunks" });
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 존재하지 않습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  /* develop 환경에서만 에러 메세지를 설정해준다 */
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
