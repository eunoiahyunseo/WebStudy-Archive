const express = require("express");
const axios = require("axios");

const router = express.Router();

const URL = `http://localhost:8002/v2`;
axios.defaults.headers.origin = "http://localhost:4000"; // origin 헤더 추가

/*
 < 추상적인 jwt의 원리를 적어보면 >

    우리는 http://localhost:8002에서 api키를 등록했다.
    
    그리고 우리는 http://localhost:4000에서 api키를 사용한다.
    
    일단 먼저 환경변수에 client_secret을 설정한 다음에 jwt토큰을 발급받는다.
    만약 status = 419로서 토큰이 만료되면 재발급 받아주어야 한다. -> verifytoken에서 막아버린다.
*/
const request = async (req, api) => {
  try {
    // 만약 jwt세션이 없다면 토큰을 발급받아야 한다.
    // 또한 클라이언트는 헤더에 자기가 발급받은 token을
    if (!req.session.jwt) {
      // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }

    // 세션에 토큰을 저장했다면 api를
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    console.log(error.response);
    if (error.response.status === 419) {
      // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt;
      // jwt토큰이 만료되면 재귀적으로 토큰을 발급받는 과정을 반복한다.
      return request(req, api);
    } // 419 외의 다른 에러면
    return error.response;
  }
};

router.get("/", (req, res) => {
  res.render("main", { key: process.env.CLIENT_SECRET });
});

router.get("/test", async (req, res, next) => {
  try {
    const result = await request(req, "/test");
    console.log('req.get("origin")', req.get("origin"));
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/mypost", async (req, res, next) => {
  try {
    const result = await request(req, "/posts/my");
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/search/:hashtag", async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

router.get("/following", async (req, res, next) => {
  try {
    const result = await request(req, `/users/following`);
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

module.exports = router;

/**
 * 기본적인 API 발급 순서
 * 1) localhost:4000에서 clientSecret을 발급받는다
 * 2) nodecat은 clientSecret을 바탕으로 localhost:8002에 요청 ( 정보 )을 보낸다.
 * 3) http://localhost:8002/token와 clientSecret을 body로써 같이 보낸다
 * 4) 그러면 3의 반환값으로 clientSecret user의 id와 nick을 가지고 있는 token을 반환해 준다.
 * 5) 그러면 nodecat은 다시 이 token을 header에 넣어서 각각의 요청을 보내고 응답을 받는다.
 */
