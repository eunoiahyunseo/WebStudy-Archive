const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const url = require("url");

const { verifyToken, apiLimiter } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();

/**
 * 브라우저와 서버의 도메인이 일치하지 않으면, 기본적으로 요청이 차단됩니다.
 * 이 현상은 브라우저에서 서버로 요청을 보낼 때만 발생하고, 서버에서 서버로 요청을 보낼 때는 발생하지 않습니다.
 * 현재 요청을 보내는 클라이언트와 요청을 받는 서버의 도메인이 다릅니다 이 문제를 CORS라고 부릅니다
 *
 * CORS문제를 해결하기 위해서는 응답 헤더에 Access-Control-Allow-Origin헤더를 넣어야 합니다.
 * 이 헤더는 클라이언트 도메인의 요청을 허락하겠다는 뜻을 가지고 있습니다.
 * res.set()메서드로 직접 넣어도 되지만 npm에는 편하게 설치할 수 있는 패키지가 있다 => cors
 *
 * 또한 이 때문에 문제가 또 발생하게 되는데
 * 요청을 보내는 주체가 클라이언트라서 비밀 키(process.env.CLIENT_SECRET)가 모두에게 노출됩니다
 * 방금 CORS도 허용했으므로 이 비밀키를 가지고 다른 도메인들이 API서버에 요청을 막무가네로 보낼 수 있게 된다.
 *
 * 이 문제를 막기 위해 처음에 비밀키 발급 시 허용한 도메인을 적게 했습니다.
 * 호스트와 비밀 키가 모두 일치할 때만 CORS를 허용하게 수정하면 된다.
 */
router.use(async (req, res, next) => {
  console.log("req.get('origin')", req.get("origin"));
  const domain = await Domain.findOne({
    /**
     * req.get('origin')과 호스트가 일치하는지 확인하기만 하면 끝이다.
     */
    where: { host: new URL(req.get("origin")).host },
    // host가 localhost:4000인 row가 있나? 있어야 진행 가능하기 때문이다.
  });
  // console.log(domain);
  /**
   * domain이 있다면
   * 허용할 도메인만 따로 적어 준다
   * < *처럼 모든 도메인을 허용하는 대신 기입한 도메인만 허용하는 것이다. >
   */
  // if (domain) {
  //   cors({
  //     // Configures the Access-Control-Allow-Origin CORS header
  //     // 그냥 위 해더를 추가 한다고 보면 됨.
  //     origin: req.get("origin"),
  //     // Set to true to pass the header
  //     credentials: true,
  //   })(req, res, next);
  // } else {
  //   next();
  // }
  next();
});
router.post("/token", async (req, res) => {
  /**
   * 전달받은 클라이언트 비밀 키로 도메인이 등록된 것인지를 먼저 확인한다.
   */
  try {
    const { clientSecret } = req.body;
    // 클라이언트에서 clientSecret을 이용해서 domain이 있는지 찾아낸다
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
    await jwt.sign(
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
router.get("/test", verifyToken, apiLimiter, (req, res) => {
  //   console.log("verfiy token => ", JSON.stringify(verifyToken, null, 2));
  res.status(200).json(req.decoded);
});

router.get("/posts/my", verifyToken, apiLimiter, async (req, res) => {
  try {
    console.log("req.decoded token check => ", JSON.stringify(req.decoded, null, 2));
    const posts = await Post.findAll({
      where: { userId: req.decoded.id },
    });
    console.log(posts);
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

router.get("/posts/hashtag/:title", verifyToken, apiLimiter, async (req, res) => {
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

router.get("/users/following", verifyToken, apiLimiter, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.decoded.id,
      },
    });
    const follwingsUserList = await user.getFollowings();
    return res.json({
      code: 200,
      payload: follwingsUserList,
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
