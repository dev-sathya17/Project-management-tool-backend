// Creating a function to handle unknown endpoints
const errorHandler = (request, response) => {
  response.status(404).send({ error: "Kindly verify the endpoint." });
};

// Exporting the function
module.exports = errorHandler;
