const path = require("path");
const express = require("express");
const routes = express.Router();
const Database = require("../helpers/database");
const { checkPassword } = require("../helpers/password");
const EmailBuilder = require("../helpers/chatbot");
const emailBuilderLookup = new EmailBuilder();

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

const renderSinglePost = async (req, res) => {
  const postId = parseInt(req.query.post, 10); // Ensure that postId is an integer

  // Protect against SQL injection by parameterizing the query
  const post = await db.selectOne("SELECT * FROM blog_posts WHERE id = ?", [
    postId,
  ]);

  const previous = await db.selectOne(
    "SELECT * FROM blog_posts WHERE id < ? ORDER BY id DESC LIMIT 1",
    [postId]
  );

  const next = await db.selectOne(
    "SELECT * FROM blog_posts WHERE id > ? ORDER BY id ASC LIMIT 1",
    [postId]
  );

  if (post) {
    res.render("components/blogpost", { post, previous, next });
  } else {
    res.status(404).render("components/error");
  }
};

const renderAllPosts = async (req, res) => {
  const posts = await db.select("SELECT * FROM blog_posts");

  if (posts && posts.length > 0) {
    res.render("components/blog", { posts });
  } else {
    res.status(404).send("No Posts Available");
  }
};

// Blog Route
routes.get("/blog", async (req, res) => {
  try {
    if (req.query.post) {
      await renderSinglePost(req, res);
    } else {
      await renderAllPosts(req, res);
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).render("components/error");
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
  res.render("components/demologin", { email: "" });
});

routes.post("/demo/generate", async (req, res) => {
  try {
    const {
      campaignGoal,
      campaignTone,
      campaignIndustry,
      campaignWeb,
      campaignTwitter,
      campaignDetails,
    } = req.body || {};

    // Guard against null or undefined values
    if (
      !campaignGoal ||
      !campaignTone ||
      !campaignIndustry ||
      !campaignDetails
    ) {
      return res.status(400).send("Required fields are missing.");
    }

    // Get index for goals and tones
    const goalIndex =
      emailBuilderLookup.goals.indexOf(campaignGoal) >= 0
        ? emailBuilderLookup.goals.indexOf(campaignGoal)
        : 0;
    const toneIndex =
      emailBuilderLookup.tones.indexOf(campaignTone) >= 0
        ? emailBuilderLookup.tones.indexOf(campaignTone)
        : 0;

    const temperatures = [0.1, 0.2, 0.5, 0.7, 0.9];

    // Create an array of promises
    const builderPromises = temperatures.map((temp) =>
      new EmailBuilder()
        .withGoal(goalIndex)
        .withTone(toneIndex)
        .withIndustry(campaignIndustry)
        .withWebsite(campaignWeb)
        .withTwitter(campaignTwitter)
        .withDetails(campaignDetails)
        .withTemperature(temp)
        .build()
    );

    const responses = await Promise.all(builderPromises);

    res.render("components/emails", { emails: responses });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

routes.post("/demo", (req, res) => {
  const { password, email } = req.body;
  const checkCredentials = checkPassword(
    email + password,
    process.env.DEMO_HASH
  );

  if (checkCredentials) {
    res.render("components/demo", {
      goals: emailBuilderLookup.goals,
      tones: emailBuilderLookup.tones,
    });
  } else {
    res.render("components/demologin", {
      email: email || "",
      error: "Incorrect email or password",
    });
  }
});

module.exports = routes;
