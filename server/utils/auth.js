const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

const { AuthenticationError } = require("apollo-server-express");

const authMiddleware = (context) => {
  let token;
  if (context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  }

  // check if the operation name is "login"
  if (
    context.req.body.operationName === "login" ||
    context.req.body.operationName === "addUser"
  ) {
    // if it is, don't throw an error and skip the middleware
    return context;
  }

  if (!token) {
    throw new AuthenticationError("You have no token!");
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    context.user = data;
  } catch (err) {
    console.log(err);
    throw new AuthenticationError("Invalid token!");
  }

  return context;
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
