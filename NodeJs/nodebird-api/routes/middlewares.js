const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { Domain } = require("../models");
const { Op } = require("sequelize");
/*
    라우터에는 접근 조건이 있다.
    로그인한 사용자는 회원가입과 로그인 라우터에 접근하면 안된다.
    마찬가지로 로그인하지 않은 사용자는 로그아웃 라우터에 접근하면 안된다.
*/

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};

/**
 * 요청 헤더에 저장된 토큰 req.headers.authorization을 사용
 */
exports.verifyToken = async (req, res, next) => {
  try {
    /**
     * 메서드의 첫 번쨰 인수로는 토큰을, 두 번째 인수로는 토큰의 비밀 키를 넣는다.
     * => 인증에 성공하게 되면 토큰의 내용이 반환되어 req.decoded에 저장됩니다.
     */
    await jwt.verify(
      // 받아온 토큰을 바탕으로 검증해서 데이터를 가져온다.
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decoded) => {
        /**
         * 토큰이 만료되면 토큰을 사용할 수 없다.
         */
        if (err && err.name === "TokenExpiredError") {
          return res.status(419).json({
            code: 419,
            message: "토큰이 만료되었습니다.",
          });
        } else if (err) {
          return res.status(401).json({
            /**
             * 토큰의 비밀 키가 일치하지 않는다면 인증을 받을 수 없다.
             */
            code: 401,
            message: "유효하지 않은 토큰입니다.",
          });
        }
        // 오류가 없는 경우만 추가
        req.decoded = decoded;
        return next();
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};

// exports.verifyToken = (req, res, next) => {
//   try {
//     req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
//     return next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       // 유효기간 초과
//       return res.status(419).json({
//         code: 419,
//         message: "토큰이 만료되었습니다",
//       });
//     }
//     return res.status(401).json({
//       code: 401,
//       message: "유효하지 않은 토큰입니다",
//     });
//   }
// };

// rateLimit이 함수로 바뀜
// 또한 우리는 무료 도메인인가 아니면 프리미엄 도메인인가를 판별해서 다른 apiLimiter를 적용시켜주어야 한다.
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: "1분에 한 번만 요청을할 수 있습니다.",
    });
  },
});

exports.apiLimiter = async (req, res, next) => {
  const currentDomain = await Domain.findOne({
    where: {
      [Op.and]: [
        {
          userId: req.decoded.id,
        },
        {
          host: new URL(req.get("origin")).host,
        },
      ],
    },
  });
  console.log("currentDomain", currentDomain);

  const { type } = currentDomain.toJSON();
  if (type === "free") {
    return rateLimit({
      windowMs: 60 * 1000, // 1분
      max: 10,
      delayMs: 0,
      handler(req, res) {
        res.status(this.statusCode).json({
          code: this.statusCode, // 기본값 429
          message: "1분에 한 번만 요청을할 수 있습니다.",
        });
      },
    })(req, res, next);
  } else {
    return rateLimit({
      windowMs: 60 * 1000, // 1분
      max: 20,
      delayMs: 0,
      handler(req, res) {
        res.status(this.statusCode).json({
          code: this.statusCode, // 기본값 429
          message: "10분에 한 번만 요청을할 수 있습니다.",
        });
      },
    })(req, res, next);
  }
};

exports.deprecated = (req, res) => {
  res.status(401).json({
    code: 410,
    message: "새로운 버전이 나왔습니다. 새로운 버전을 사용허세요.",
  });
};

// API 응답 목록
/*
  200  ->  JSON 데이터입니다.
  401  ->  유효하지 않은 토큰입니다.
  419  ->  토큰이 만료되었습니다.
  429  ->  1분에 한번만 요청할 수 있습니다.
  500~ ->  기타 서버 에러
*/
