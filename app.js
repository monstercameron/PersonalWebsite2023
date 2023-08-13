const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const Database = require('./helpers/database');
const db = new Database();

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

// Define routes
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/home", function (req, res) {
  res.render("components/aboutme");
});

app.get("/projects", function (req, res) {
  res.render("components/aboutme");
});

app.get("/resume", function (req, res) {
  res.render("components/aboutme");
});

app.get("/blog", function (req, res) {
  res.render("components/aboutme");
});

app.get("/workshop", function (req, res) {
  res.render("components/aboutme");
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  // Log error to error.log file
  errorLogStream.write(`${new Date().toISOString()}: ${err.stack}\n`);
  res.status(500).send("Something broke!");
});

module.exports = app;