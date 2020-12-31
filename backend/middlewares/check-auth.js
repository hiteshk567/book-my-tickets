const jwt = require("jsonwebtoken");

const HttpError = require("../models/error-model");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; //  Authorization: "Bearer TOKEN"

    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedtoken = jwt.verify(token, process.env.JWT_KEY);

    req.userData = {
      userId: decodedtoken.userId,
      role: decodedtoken.role,
    };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
};
