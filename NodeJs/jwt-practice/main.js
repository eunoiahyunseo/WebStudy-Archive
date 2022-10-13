// @ts-check

const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const randToken = require("rand-token");
const { secretKey, options } = require("./config/options");

const app = express();

app.set("PORT", process.env.PORT || 3008);

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

/**
 * user data
 * @typedef {Object} userData
 * @property {string} userId - userid
 * @property {string} secretKey - secretKey for jwt
 * @property {string} nick - nickname of user
 * yea!
 */
app.post("/sign", (req, res) => {
  /**
   * @type {userData}
   */
  const { userId, secretKey, nick } = req.body;
  const payload = { id: userId, nick };

  // @ts-ignore
  jwt.sign(payload, secretKey, options, (err, token) => {
    if (err) {
      return res.json({
        code: 500,
        message: `토큰 발급에 실패하였습니다.`,
      });
    }
    return res.status(201).json({
      code: 200,
      message: `토큰이 발급되었습니다.`,
      ...{
        token,
        refreshToken: randToken.uid(256),
      },
    });
  });
});

app.post("/verify", (req, res, next) => {
  const { authorization } = req.headers;
  jwt.verify(authorization, secretKey, (err, decoded) => {
    /**
     * ! 토큰이 만료되면 토큰을 사용할 수 없다.
     */
    if (err && err.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    } else if (err) {
      return res.status(401).json({
        /**
         * ! 토큰의 비밀 키가 일치하지 않는다면 인증을 받을 수 없다.
         */
        code: 401,
        message: "유효하지 않은 토큰입니다.",
      });
    }
    //@ts-ignore
    return res.status(201).json({
      code: 200,
      message: "토큰이 성공적으로 검증되었습니다.",
      decoded,
    });
  });
});

app.listen(app.get("PORT"), () => {
  console.log(`*:: listening at ${app.get("PORT")}`);
});
