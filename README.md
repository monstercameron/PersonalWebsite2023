## README for Personal Website 2023

Welcome to the repository for my personal website! This site serves as a reflection of my work, projects, and articles.

### 🚀 Technologies Used

- **Node.js**: The primary runtime enabling server-side functionality.
- **Express**: A minimalist web framework for Node.js, allowing for easy route and middleware setup.
- **EJS**: Embedded JavaScript templates. This templating engine helps dynamically generate the HTML for the website.
- **HTMX**: Enables modern AJAX requests, making the website more interactive.
- Other supporting libraries: 
  - `bcrypt` for password hashing and checking.
  - `body-parser` for parsing incoming request bodies.
  - `morgan` for HTTP request logging.
  - `sqlite3` as a lightweight database solution.
  - `dotenv` for managing environment variables.
  - `nodemon` for development, which restarts the server automatically upon file changes.

### 📁 Project Structure

The main entry point of the app is `index.js`. 

- `server.js` is responsible for initiating the server.
- Helper scripts can be found in the `helpers/` directory, which contains utilities like password hashing and demo data scripts.
- All routes and their associated functionalities are in the `routes/` directory.
- EJS templates are stored in respective directories which define how the content is rendered on the webpage.
  
### 🚴 Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/monstercameron/PersonalWebsite2023
   ```

2. Navigate to the project directory:

   ```bash
   cd personalwebsite2023
   ```

3. Install the required packages:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The server will start, and you should be able to access the website at `http://localhost:3000`.

### 📄 Scripts

- `npm start`: Starts the server using nodemon for hot reloading.
- `npm run demo:blog`: Populates the database with demo blog data.
- `npm run demo:projects`: Populates the database with demo project data.

### 📜 License

This project is licensed under the ISC License.

---

Thank you for checking out my personal website's repository! Feel free to fork, star, and share. If you have any feedback or questions, please drop me a message.