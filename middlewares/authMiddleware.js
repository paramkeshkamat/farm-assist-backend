/** @format */

const createError = require("http-errors");
const { verifyJwtToken } = require("../helpers/jwtHelper");

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    let token = authHeader.split(" ")[1];
    const isVerified = verifyJwtToken(token);
    if (!isVerified) {
      next(createError.Forbidden());
    }
    req.user = isVerified.id;
    next();
  } else {
    next(createError.Unauthorized());
  }
};

module.exports = auth;
