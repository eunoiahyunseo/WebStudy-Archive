const SSE = require("sse");

module.exports = (server, app) => {
  const sse = new SSE(server);
  app.set("sse", sse);
  sse.on("connection", (client) => {
    /**
     * 클라이언트에 메시지를 보낼 때 이 sse객체를 사용한다.
     *
     * 1초마다 접속한 클라이언트에 서버 시간 타임스탬프를 보내도록 했다
     */
    setInterval(() => {
      client.send(Date.now().toString());
    }, 1000);
  });
};
