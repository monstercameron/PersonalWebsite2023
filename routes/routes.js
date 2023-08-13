const Database = require("../helpers/database");
const db = new Database();
const routes = require("express").Router();

routes
  .get("/", (req, res) => {
    res.render("pages/index");
  })
  .get("/home", (req, res) => {
    res.render("components/aboutme");
  })
  .get("/projects", async (req, res) => {
    try {
      const projects = await db.select("SELECT * FROM projects");
      res.render("components/projects", { projects });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).send("Internal Server Error");
    }
  })
  .get("/resume", (req, res) => {
    res.render("components/resume");
  })
  .get("/blog", async (req, res) => {
    try {
      const posts = await db.select("SELECT * FROM blog_posts");
      res.render("components/blog", { posts });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).send("Internal Server Error");
    }
  })
  .get("/workshop", (req, res) => {
    res.render("components/workshop");
  })
  .post("/workshop", (req, res) => {
    console.log("Workshop post request received", req.body);
    res.render("components/workshop");
  });

module.exports = routes;
