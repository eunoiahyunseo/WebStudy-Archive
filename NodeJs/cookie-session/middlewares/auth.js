const axios = require("axios");

exports.authUtil = async (req, res, next) => {
  console.log("logined >> ", req.session.logined);
  if (req.session.logined) {
    try {
      const { data } = await axios.post(
        "http://localhost:3008/verify",
        {},
        {
          headers: { authorization: req.session.jwtToken },
        }
      );
      req.decoded = data.decoded;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  next();
};
