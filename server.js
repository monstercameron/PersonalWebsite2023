const app = require("./app");

// Set default port to 3000 if not specified in environment variables
const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
