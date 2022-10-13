const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

/*
    기존에 같은 이메일로 가입한 사용자가 있는지 데이터베이스에서 조회한 후,
    있다면 회원가입 페이지로 되돌려보냅니다.

    단 주소 뒤에 에러를 쿼리스트링으로 표현합니다.

    같은 이메일로 가입한 사용자가 없다면 비밀번호를 암호화하고, 사용자 정보를 생성합니다.
*/

/**
 * TODO: 회원가입 라우터는 필요없어서 삭제
 */

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.status(201).redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

/*
    GET /auth/kakao로 접근하면 카카오 로그인 과정이 시작됩니다.
    GET /auth/kakao에서 로그인 전략을 수행하는데, 처음에는 카카오 로그인 창으로 리다이렉트 합니다.
    그 창에서 로그인 후 성공 여부 결과를 GET /auth/kakao/callback으로 받습니다.
    이 라우터에서는 카카오 로그인 전략을 다시 수행합니다.
*/

router.get("/kakao", passport.authenticate("kakao"));

/*
    로컬 로그인과 다른 점은 passport.authenticate메서드에 콜백 함수를 제공하지 않는다는 점이다.
    카카오 로그인은 로그인 성공 시 내부적으로 req.login을 호출하므로 우리가 직접 호출할 필요가 없다.
*/

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
