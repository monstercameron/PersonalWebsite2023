const path = require("path");
const express = require("express");
const routes = express.Router();
const Database = require("../helpers/database");
const { checkPassword } = require("../helpers/password");
const EmailBuilder = require("../helpers/chatbot");

const db = new Database();

// Home Route
routes.get("/", (req, res) => {
  res.render("pages/index");
});

// About Me Route
routes.get("/home", (req, res) => {
  res.render("components/aboutme");
});

// Projects Route
routes.get("/projects", async (req, res) => {
  try {
    const projects = await db.select("SELECT * FROM projects");
    res.render("components/projects", { projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Resume Route
routes.get("/resume", (req, res) => {
  res.render("components/resume");
});

// Resume Route
routes.get("/resume/markdown", (req, res) => {
  const filePath = path.join(__dirname, "../public/files/resume.md");
  res.sendFile(filePath);
});

// Blog Route
routes.get("/blog", async (req, res) => {
  try {
    const posts = await db.select("SELECT * FROM blog_posts");
    res.render("components/blog", { posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Workshop Routes
routes.get("/workshop", (req, res) => {
  res.render("components/workshop", { email: "" });
});

routes.post("/workshop", (req, res) => {
  const { password, email } = req.body;
  const checkCredentials = checkPassword(email + password, process.env.HASH);

  if (checkCredentials) {
    res.render("components/workshoplink", { link: process.env.WORKSHOP });
  } else {
    res.render("components/workshop", {
      email: email || "",
      error: "Incorrect email or password",
    });
  }
});


// Demo Routes
routes.get("/demo", async (req, res) => {
  const builder = new EmailBuilder()
  res.render("components/demo", { goals: builder.goals, tones: builder.tones });
});


routes.post("/demo/generate", async (req, res) => {
  // res.render("components/demologin", { email: "" });
  const builder = new EmailBuilder()
        .withGoal(0)
        .withTone(1)
        .withIndustry('Software')
        .withDetails('This is our latest update.');

    const response = await builder.build();
    console.log(response);
  res.render("components/demo", { response: response });
});

routes.post("/demo", (req, res) => {
  const { password, email } = req.body;
  const checkCredentials = checkPassword(email + password, process.env.HASH);

  if (checkCredentials) {
    res.render("components/demo");
  } else {
    res.render("components/demologin", {
      email: email || "",
      error: "Incorrect email or password",
    });
  }
});

module.exports = routes;
