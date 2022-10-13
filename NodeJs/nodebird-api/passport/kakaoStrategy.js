const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile", profile);
        // console.log("accessToken", accessToken);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            const tokenUser = { ...exUser, ...{ accessToken } };
            // console.log("tokenUser >> ", tokenUser);
            done(null, tokenUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            const tokenUser = { ...newUser, ...{ accessToken } };
            // console.log("tokenUser >> ", tokenUser);
            // console.log("newUser", newUser);
            done(null, tokenUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
