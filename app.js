require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const routes = require("./routes/routes");

const app = express();

// Directories and Logging Setup
const logsDirectory = path.join(__dirname, "logs");

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

const apiLogStream = fs.createWriteStream(path.join(logsDirectory, "api.log"), { flags: "a" });
const errorLogStream = fs.createWriteStream(path.join(logsDirectory, "error.log"), { flags: "a" });

// Middleware Setup
app.use(morgan("combined", { stream: apiLogStream }));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Route Definitions
app.use("/", routes);

// 404 Error Route
app.use((req, res, next) => {
    res.status(404).render("pages/404");
});

// Generic Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    errorLogStream.write(`${new Date().toISOString()}: ${err.stack}\n`);
    res.status(500).send("Something broke!");
});

module.exports = app;
