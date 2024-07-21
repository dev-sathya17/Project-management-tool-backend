// Creating a custom logger function
const logger = (req, res, next) => {
  //   console.log(req);
  console.log("HTTP Method:", req.method);
  console.log("Endpoint:", req.path);
  console.log("Request Body:", req.body);
  console.log("Query Params:", req.query);
  console.log("Request Params:", req.params);
  console.log("Cookies:", req.cookies);
  console.log("-----------------------------------");

  // Continue to the next middleware or route handler
  next();
};

// Export the logger function
module.exports = logger;
