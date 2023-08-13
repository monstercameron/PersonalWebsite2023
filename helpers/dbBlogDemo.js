const Database = require('./database');  // Adjust path accordingly

const db = new Database();

// SQL to create the blog_posts table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    date TEXT NOT NULL
  );
`;

// Initialize the table
db.initialize(createTableSQL).then(() => {

  // Entries for the blog posts
  const posts = [
    {
      title: "The Rise of AI",
      content: "Artificial Intelligence (AI) is transforming the world. From smart assistants to self-driving cars, AI is the future.",
      author: "John Doe",
      date: new Date().toISOString()
    },
    {
      title: "Tech Innovations in 2023",
      content: "The tech landscape in 2023 is thriving with advancements in quantum computing, AR/VR, and edge computing.",
      author: "Jane Smith",
      date: new Date().toISOString()
    },
    {
      title: "The Ethics of AI",
      content: "As AI becomes more prevalent, it's crucial to address the ethical implications, from job displacement to decision-making biases.",
      author: "Alice Williams",
      date: new Date().toISOString()
    }
  ];

  // Insert the blog post entries into the database
  const insertPromises = posts.map(post => {
    return db.insert("INSERT INTO blog_posts (title, content, author, date) VALUES (?, ?, ?, ?)", 
      [post.title, post.content, post.author, post.date]);
  });

  // Handle insertion results
  Promise.all(insertPromises).then(result => {
    console.log("All blog posts have been inserted!");
    // Close the database (optional in this case)
    db.close();
  }).catch(error => {
    console.error("Error inserting blog posts:", error);
  });

}).catch(error => {
  console.error("Error initializing the database:", error);
});
