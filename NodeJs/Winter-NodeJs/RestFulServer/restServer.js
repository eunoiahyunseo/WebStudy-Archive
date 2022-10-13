const http = require("http");
const fs = require("fs").promises;

let users = { 123123: "hyunseo" };

http
  .createServer(async (req, res) => {
    try {
      console.log(req.method, req.url);
      if (req.method === "GET") {
        if (req.url === "/") {
          const data = await fs.readFile("./restFront.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/about") {
          const data = await fs.readFile("./about.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url === "/users") {
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end(JSON.stringify(users));
        }
        // 주소가 / 도 아니고 /about도 아니면
        try {
          // console.log("doing");
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (err) {
          // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found에러 발생
        }
      } else if (req.method === "POST") {
        if (req.url === "/user") {
          let body = "";

          req.on("data", (data) => {
            body += data;
          });

          return req.on("end", () => {
            // console.log("POST 본문(Body): ", body);
            const { name } = JSON.parse(body);
            const id = Date.now();
            users = { ...users, ...{ [id]: name } };
            console.log("user: ", JSON.stringify(users));
            res.writeHead(201, { Location: "/" });
            res.end("finish enrolled");
          });
        }
      } else if (req.method === "PUT") {
        console.log(req);
        console.log(res);
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });

          return req.on("end", () => {
            console.log("PUT 본문(Body): ", body);
            users = { ...users, ...{ [key]: JSON.parse(body).name } };
            // users[id] = name;
            return res.end(JSON.stringify(users));
          });
        }
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end(err);
    }
  })
  .listen(8082, () => {
    console.log("8082번 포트에서 서버 대기중입니다.");
  });
