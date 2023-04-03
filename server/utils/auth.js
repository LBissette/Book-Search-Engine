import { verify, sign } from "jsonwebtoken";

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

import { AuthenticationError } from "apollo-server-express";

const authMiddleware = (context) => {
  let token;
  if (context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  }

  if (
    context.req.body.operationName === "login" ||
    context.req.body.operationName === "addUser"
  ) {
    return context;
  }

  if (!token) {
    throw new AuthenticationError("You have no token!");
  }

  try {
    const { data } = verify(token, secret, { maxAge: expiration });
    context.user = data;
  } catch (err) {
    console.log(err);
    throw new AuthenticationError("Invalid token!");
  }

  return context;
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };

  return sign({ data: payload }, secret, { expiresIn: expiration });
};

export default { authMiddleware, signToken };
