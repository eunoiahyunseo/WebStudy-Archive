// const WebSocket = require("ws");

// module.exports = (server) => {
//   const wss = new WebSocket.Server({ server });

//   wss.on("connection", (ws, req) => {
//     // 웹 소켓 연결 시
//     const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//     console.log("새로운 클라이언트 접속", ip);

//     ws.on("message", (message) => {
//       // 클라이언트로부터 메시지 수신 시
//       console.log(message);
//     });

//     ws.on("error", (error) => {
//       // 에러 시
//       console.error(error);
//     });

//     ws.on("close", () => {
//       // 연결 종료 시
//       console.log("클라이언트 접속 해재", ip);
//       clearInterval(ws.interval);
//     });
//     ws.interval = setInterval(() => {
//       // 3초마다 클라이언트로 메시지 전송
//       if (ws.readyState === ws.OPEN) {
//         ws.send("서버에서 클라이언트로 메세지를 보냅니다.");
//       }
//     }, 3000);
//   });
// };

/**
 * socket.io를 통한 webSocket 구현
 */

// const SocketIO = require("socket.io");

// module.exports = (server) => {
//   const io = SocketIO(server, { path: "/socket.io" });

//   io.on("connection", (socket) => {
//     // 웹 소켓 연결 시
//     const req = socket.request;
//     // TODO: 이 값들 확인
//     const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

//     console.log("새로운 클라이언트 접속!", ip, socket.id, req.ip);

//     socket.on("disconnect", () => {
//       // 연결 종료 시
//       console.log("클라이언트 접속 해제", ip, socket.id);
//       clearInterval(socket.interval);
//     });

//     socket.on("error", (error) => {
//       // 에러 시
//       console.error(error);
//     });

//     socket.on("reply", (data) => {
//       // 클라이언트로부터 메시지 수신 시
//       console.log(data);
//     });

//     socket.interval = setInterval(() => {
//       // 3초마다 클라이언트로 메시지 전송
//       socket.emit("news", "Hello Socket.IO");
//     }, 3000);
//   });
// };

/**
 * socket.io를 통한 채팅방 구현
 */

const SocketIO = require("socket.io");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const cookie = require("cookie-signature");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);
  /**
   * Socket.IO에 네임스페이스를 부여하는 메서드입니다
   * Socket.IO는 기본적으로 /네임스페이스에 접속하지만, of메서드를 사용한다면 다른 네임스페이스를 만들어
   * 접속할 수 있습니다. 같은 네임스페이스끼리만 데이터를 전달합니다.
   *
   * 1) 현재 채팅방 생성 및 삭제에 관한 정보를 전달하는 /room
   * 2) 채팅 메시지를 전달하는 /chat
   */
  const room = io.of("/room");
  const chat = io.of("/chat");

  /**
   * Societ.IO도 미들웨어를 사용할 수 있으므로 express-session을 여기에서 공유하면 된다.
   */
  io.use((socket, next) => {
    cookieParser(process.env.COOKIE_SECRET)(
      socket.request,
      socket.request.res,
      next
    );
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  /**
   * room 네임스페이스에 접속했을 시
   */
  room.on("connection", (socket) => {
    console.log("room 네임스페이스에 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  /**
   * chat 네임스페이스에 접속했을 시
   * 해당 URL의 roomID방으로 바로 접속이 된다.
   */
  chat.on("connection", (socket) => {
    console.log("chat socket.id의 값이 고유한지 확인", socket.id);
    console.log("chat socket.request.session", socket.request.session);
    /**
     * Socket.IO에는 네임스페이스보다 더 세부적인 개념으로 '방(room)'이라는 것이 있습니다.
     * 같은 네임스페이스 안에서도 같은 방에 들어있는 소켓끼리만 데이터를 주고받을 수 있습니다.
     *
     * socket.request.headers.referer를 통해 현재 웹 페이지의 URL을 가져올 수 있고
     * URL에서 방 아이디 부분을 추출했습니다.
     */
    console.log("chat 네임스페이스에 접속");
    const req = socket.request;
    // console.log("req.session.color", req.session);
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split("/")
      [referer.split("/").length - 1].replace(/\?.+/, "");
    socket.join(roomId);

    /**
     * 만약에 join 한다면 한번 더 해주어야 하는 것이 있는데
     * 나말고 다른 대상들에게 내가 참가했다고 인원 수를 1증가 시켜준다고 pCount를 갱신시켜 주는 것이다.
     */
    // console.log("socket.request", socket.request.session);

    socket.broadcast.to(roomId).emit("join", {
      user: "system",
      chat: `${req.session.color}님이 입장하셨습니다.`,
      /* TODO: join을 할것 이므로 이전에 있던 인원에 + 1을 한 값을 보내주어야 한다. */
      pCount: socket.adapter.rooms[roomId].length,
    });

    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제");
      /**
       * 방에서 나가는 메서드 socket.leave
       */
      socket.leave(roomId);
      /**
       * socket.adapter.room[방 아이디]에 참여중인 소켓 정보가 들어있습니다.
       * 참여자 수가 0명이 아니면 방에 남아있는 참여자에게 퇴장했다는 데이터를 보냅니다.
       */
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if (userCount === 0) {
        // 접속자가 0명이면 방 삭제
        /**
         * req.signedCookies 내부의 쿠키들은 모두 복호화되어 있으므로 다시 암호화해서 요청에 담아보내야 합니다.
         * 이제 DELETE /room/:id 라우터에서 req.user를 통해 요청자가 누구인지 확인할 수 있게 되었다.
         *
         * < express-session에서는 세션 쿠키인 req.signedCookies['connect.sid']를 보고 현재 세션이 누구에게 속해있는지를
         * 판단합니다 >
         */
        console.log(req.session.id);
        console.log("req.signedCookies", req.signedCookies);
        const signedCookie = req.signedCookies["connect.sid"];
        const connectSID = cookie.sign(signedCookie, process.env.COOKIE_SECRET);

        // socket.js에서 axios요청을 보낼 때는 요청자가 누구인지에 대한 정보가 들어있지 않습니다.
        // express-session에서는 세션 쿠키인 req.signedCookies['connect.sid']를 보고 현제 세션이 누구에게
        // 속해 있는지를 판단합니다.
        // 브라우저는 axios요청을
        axios
          .delete(`http://localhost:8005/room/${roomId}`, {
            headers: {
              Cookie: `connect.sid=s%3A${connectSID}`,
            },
          })
          .then(() => {
            console.log("방 제거 요청 성공");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
          pCount: currentRoom.length,
        });
      }
    });
  });
};
