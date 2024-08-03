// Importing the jwt library
const jwt = require("jsonwebtoken");

// Importing the Secret key
const { SECRET_KEY } = require("../utils/config");

// Importing the User model
const User = require("../models/user");

const auth = {
  // Authentication middleware to check if the user is authenticated
  authenticate: (request, response, next) => {
    try {
      // getting the token from the cookie
      const token = request.cookies.token;

      // if the token does not exist, return unauthorized
      if (!token) {
        return response.status(403).send({ message: "Access denied" });
      }
      // verifying the token
      try {
        const decodedToken = jwt.verify(token, SECRET_KEY);

        // setting the user id in the request object
        request.userId = decodedToken.id;

        // calling the next middleware
        next();
      } catch (error) {
        // Sending an error message for an invalid token
        return response.status(401).send({ message: "Invalid token" });
      }
    } catch (error) {
      // Sending an error response
      response.status(500).send({ message: error.message });
    }
  },

  // Authorization middleware to check if the user is authorized
  authorize: async (request, response, next) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId);

      // If user is not found
      if (!user) {
        return response.status(404).send({ message: "User not found" });
      }

      // If user is not admin
      if (user.role !== "teamLeader" && user.role !== "admin") {
        return response
          .status(401)
          .send({ message: "You are not authorized." });
      }

      // call the next middleware
      next();
    } catch (error) {
      response
        .status(500)
        .send({ message: "an error occured during authorization", error });
    }
  },

  // Middleware to check if the user account is activated
  isActivated: async (request, response, next) => {
    try {
      let user = null;
      // Checking if the user is already activated before or after logging in
      if (request.userId) {
        user = await User.findById(request.userId);
      } else {
        user = await User.findOne({ email: request.body.email });
      }
      // If user is not found
      if (!user) {
        return response.status(404).send({ message: "User not found" });
      }

      // If user is not active, return an error response
      if (!user.isActive) {
        return response
          .status(403)
          .send({
            message:
              "User account is not active. Kindly check your email to activate your account",
          });
      }

      // If user is active, call the next middleware
      next();
    } catch (error) {
      response.status(500).send({
        message: "an error occured during account activation check",
        error,
      });
    }
  },

  // Middleware to check if the user is an admin
  isAdmin: async (request, response, next) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId);
      // If user is not found
      if (!user) {
        return response.status(404).send({ message: "User not found" });
      }
      // If user is not admin, return an error response
      if (user.role !== "admin") {
        return response
          .status(401)
          .send({ message: "You are not authorized." });
      }
      // If user is admin, call the next middleware
      next();
    } catch (error) {
      response
        .status(500)
        .send({ message: "an error occured during admin check", error });
    }
  },

  // Middleware for cache control
  cacheControl: (request, response, next) => {
    response.setHeader("Cache-Control", "no-store");
    next();
  },
};

module.exports = auth;
