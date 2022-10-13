const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

try {
  fs.readdirSync("uploads");
} catch (err) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

const router = express.Router();

/**
 * 메인 페이지 라우터
 */
router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render("main", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * room페이지 라우터
 */
router.get("/room", (req, res) => {
  res.render("room", { title: "GIF 채팅방 생성" });
});

/**
 * new Room 생성 라우터
 */
router.post("/room", async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom);

    // 일단 방에 입장하면 /room/id?password~ 식의 url로 들어오게 된다.
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 방 입장
 */
router.get("/room/:id", async (req, res, next) => {
  try {
    // 일단 id에 해당하는 room을 찾는다.
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get("io");
    if (!room) {
      return res.redirect("/?error=존재하지 않는 방입니다.");
    }

    // 또한 room의 password와 쿼리로 준 password가 다르다면 오류를 보내고
    if (room.password && room.password !== req.query.password) {
      return res.redirect("/?error=비밀번호가 틀렸습니다.");
    }

    // chat 네임스페이스에 방정보를 room에 가져온다.
    const { rooms } = io.of("/chat").adapter;

    // 만약 rooms가 있고 파라미터로 준 id에 해당하는 방이 있고 정원이 차지 않았을 경우만 아래로 실행되게끔
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      return res.redirect("/?error=허용 인원을 초가했습니다.");
    }

    /**
     * 이 룸과 관련된 모든 채팅들을 생성 순서대로 정렬한다음에 배열에 담는다
     * 또한 지금 들어온 방과 관련된 채팅들을 다 가져와서 화면에 보여준다.
     */
    const chats = await Chat.find({ room: room._id }).sort("createdAt");

    const pCount = rooms[req.params.id] ? rooms[req.params.id].length + 1 : 1;

    console.log("pCount", pCount);

    // chat네임스페이스에 들어간다.
    return res.render("chat", {
      room,
      title: room.title,
      chats,
      user: req.session.color,
      /* 현재 방에 참여중인 인원을 표시 */
      pCount,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 방을 삭제 해주는 라우터
 */
router.delete("/room/:id", async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });

    res.send("ok");
    setTimeout(() => {
      req.app.get("io").of("/room").emit("removeRoom", req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 해당 방에서 새로운 채팅을 쳤을 때의 라우터
 */
router.post("/room/:id/chat", async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * gif사진을 올렸을 때의 라우터
 */
router.post("/room/:id/gif", upload.single("gif"), async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    /**
     * 내가 채팅을 쳤으면 emit('chat')을 함으로써 나와 /chat이고 같은 방에 속해있는 상대방들에게 전송해 준다
     * gif이니까 chat은 없다
     */
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
