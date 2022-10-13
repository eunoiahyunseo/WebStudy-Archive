const express = require("express");
const jwt = require("jsonwebtoken");

const { verifyToken, deprecated } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();

router.use(deprecated);

router.post("/token", async (req, res) => {
  /**
   * 전달받은 클라이언트 비밀 키로 도메인이 등록된 것인지를 먼저 확인한다.
   */
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: {
        clientSecret,
      },
      include: {
        model: User,
        attribute: ["nick", "id"],
      },
    });
    /**
     * 도메인이 존재 하지 않는다면 오류를 전달한다.
     * 또한 API는 아래처럼 일정한 형식으로 json데이터를 반환하는 것이 적절할 듯..?
     */
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요",
      });
    }

    /**
     * 만약 해당하는 clientSecret이 존재한다면 토큰을 클라이언트로 발급해 준다.
     *
     * 첫번째로는 사용자의 아이디와 닉네임
     * 두번째로는 호스트의 jwt_secret을 -> 이가 노출되면 아무든 토큰을 발급할 수 있게 되므로 숨겨야 한다
     * 세번째로는 토큰의 설정 ( 만료 기간, 발급자 )를 명시해 주었다.
     */
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    // callback함수를 주어주었을떄는 sign함수는 비동기 함수가 되므로 꼭 Promise처리를 해주어야 한다.
    const token = await jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        // A numeric value is interpreted as a seconds count
        expiresIn: "1m",
        issuer: "nodebird",
      },
      (err, token) => {
        if (err) {
          return res.json({
            code: 500,
            message: `토큰 발급에 실패하였습니다.`,
          });
        }
        return res.json({
          code: 200,
          message: "토큰이 발급되었습니다",
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

/*
    사용자가 발급받은 토큰을 테스트해볼 수 있는 라우터입니다.
*/
router.get("/test", verifyToken, (req, res) => {
  //   console.log("verfiy token => ", JSON.stringify(verifyToken, null, 2));
  res.status(200).json(req.decoded);
});

// 모든 post를
router.get("/posts/my", verifyToken, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.decoded.id },
    });
    console.log("posts => ", JSON.stringify(posts[0], null, 2));
    res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

router.get("/posts/hashtag/:title", verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    console.log("hashtag => ", JSON.stringify(hashtag, null, 2));
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: "검색 결과가 없습니다",
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

module.exports = router;
