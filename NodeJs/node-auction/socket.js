const SocketIO = require("socket.io");

module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);
  io.on("connection", (socket) => {
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer.split("/")[referer.split("/").length - 1];
    socket.join(roomId);

    socket.on("disconnect", () => {
      // 자동으로 끊기긴 하지만 명시적으로 나가기 위해서 적음
      socket.leave(roomId);
    });
  });
};
