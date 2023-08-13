const express = require("express");
const app = express();
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

// Create logs directory if it doesn't exist
const logsDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Create a write stream for API logs
const apiLogStream = fs.createWriteStream(path.join(logsDirectory, "api.log"), {
  flags: "a",
});

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDirectory, "error.log"),
  { flags: "a" }
);

// Use morgan for API logging
app.use(
  morgan("combined", {
    stream: apiLogStream,
  })
);

// Set view engine and static folder
app.set("view engine", "ejs");
app.use(express.static("public"));

// Use body-parser middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes
app.use("/", routes);

// Error route for page not found
app.use(function (req, res, next) {
  res.status(404).render("pages/404");
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  // Log error to error.log file
  errorLogStream.write(`${new Date().toISOString()}: ${err.stack}\n`);
  res.status(500).send("Something broke!");
});

module.exports = app;
