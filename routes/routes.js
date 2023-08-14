const express = require("express");
const routes = express.Router();
const Database = require("../helpers/database");
const { hashPassword, checkPassword } = require("../helpers/password");

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

module.exports = routes;
