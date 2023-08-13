const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const Database = require("./helpers/database");
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
app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/home", (req, res) => {
  res.render("components/aboutme");
});

app.get("/projects", (req, res) => {
  res.render("components/projects");
});

app.get("/resume", (req, res) => {
  res.render("components/resume");
});

app.get("/blog", async (req, res) => {
  try {
    const posts = await db.select("SELECT * FROM blog_posts");

    // Start building the HTML response
    // let html = "<h1>Blog Posts</h1>";

    // Iterate over each post to create an HTML representation
    // for (const post of posts) {
    //   html += `
    //             <div style="border: 1px solid black; margin-bottom: 20px; padding: 10px;">
    //                 <h2>${post.title}</h2>
    //                 <p>${post.content}</p>
    //                 <p><strong>Author:</strong> ${post.author}</p>
    //                 <p><strong>Date:</strong> ${post.date}</p>
    //             </div>
    //         `;
    // }
    // res.send(html);

    res.render("components/blog", { posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/workshop", (req, res) => {
  res.render("components/workshop");
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  // Log error to error.log file
  errorLogStream.write(`${new Date().toISOString()}: ${err.stack}\n`);
  res.status(500).send("Something broke!");
});

module.exports = app;
