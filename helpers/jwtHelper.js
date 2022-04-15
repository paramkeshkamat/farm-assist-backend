const { sign, verify } = require("jsonwebtoken");

module.exports = {
  getJwtToken: (id) => sign({ id }, process.env.JWT_SECRET),
  verifyJwtToken: (token) => verify(token, process.env.JWT_SECRET),
};
