// Importing the jwt library
const jwt = require("jsonwebtoken");

// Importing the Secret key
const { SECRET_KEY } = require("../utils/config");

const auth = {
  authenticate: (request, response, next) => {
    try {
      // getting the token from the cookie
      const token = request.cookies.token;

      // if the token does not exist, return unauthorized
      if (!token) {
        return response.status(401).send({ message: "Access denied" });
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
};

module.exports = auth;
