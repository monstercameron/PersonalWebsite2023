const Database = require("./database"); // Adjust path accordingly

const db = new Database();

// SQL to create the blog_posts table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reponame TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    imgurl TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL
  );
`;

// Initialize the table
db.initialize(createTableSQL)
  .then(() => {
    // Entries for the Projects
    const posts = [
      {
        reponame: "MetaHumanServer",
        title: "Conversational AI.",
        url: "https://github.com/monstercameron/MetaHumanServer",
        imgurl:"/images/testbackground1.webp",
        description:
          "Welcome to the Meta Human Server! This sophisticated piece of software, built entirely on Python, combines some of the most incredible advancements in artificial intelligence, natural language processing, and audio processing to create an interactive voice-activated chatbot that listens, understands, and responds to your prompts in a way that feels incredibly human. Let's delve into the fun, feature-filled, and exciting world of Meta Human Server!",
        date: new Date().toISOString(),
      },
      {
        reponame: "ChatGPTIntegration-2023",
        title: "Integrated Chatbot.",
        url: "https://github.com/monstercameron/ChatGPTIntegration-2023",
        imgurl:"/images/testbackground1.webp",
        description:
          "This project is a chat assistant that can make API calls based on user prompts and provide responses. It is built using JavaScript and the OpenAI GPT-3.5 model.",
        date: new Date().toISOString(),
      },
      {
        reponame: "EnglishScript",
        title: "Experimental English Programming Language.",
        url: "https://github.com/monstercameron/EnglishScript",
        imgurl:"/images/testbackground1.webp",
        description:
          "The English Script Programming Language Compiler is a python application that uses OpenAI's GPT-3.5 model to translate English scripts into JavaScript. The application follows certain rules and uses an alias system to understand and transcribe the English scripts. It creates an output JavaScript file and also has the capability to execute this file.",
        date: new Date().toISOString(),
      },
    ];

    // Insert the projects entries into the database
    const insertPromises = posts.map((post) => {
      return db.insert(
        "INSERT INTO projects (reponame, title, description, url, imgurl, date) VALUES (?, ?, ?, ?, ?, ?)",
        [post.reponame, post.title, post.description, post.url, post.imgurl, post.date]
      );
    });

    // Handle insertion results
    Promise.all(insertPromises)
      .then((result) => {
        console.log("All Pojects posts have been inserted!");
        // Close the database (optional in this case)
        db.close();
      })
      .catch((error) => {
        console.error("Error inserting projects:", error);
      });
  })
  .catch((error) => {
    console.error("Error initializing the database:", error);
  });
