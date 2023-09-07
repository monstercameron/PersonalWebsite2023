const sqlite3 = require("sqlite3").verbose();

class Database {
  constructor(databasePath = "./database.db") {
    // Connect to the SQLite database or create a new one
    this.db = new sqlite3.Database(databasePath, (err) => {
      if (err) {
        console.error("Error connecting to the database:", err.message);
      } else {
        console.log("Connected to the SQLite database.");
      }
    });

    // Handle application termination to close the database connection
    process.on("SIGINT", () => {
      this.close(() => {
        console.log("Database connection closed due to app termination");
        process.exit(0);
      });
    });
  }

  /**
   * Initializes the database with the provided SQL schema.
   * @param {string} sqlSchema - The SQL string to initialize the database tables.
   */
  initialize(sqlSchema) {
    return new Promise((resolve, reject) => {
      this.db.exec(sqlSchema, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  /**
   * Inserts data into the database.
   * @param {string} sql - The SQL string for the insert operation.
   * @param {Array} params - Parameters for the SQL statement.
   */
  insert(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  }

  /**
   * Select data from the database.
   * @param {string} sql - The SQL string for the select operation.
   * @param {Array} params - Parameters for the SQL statement.
   */
  select(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  /**
   * Select a single record from the database.
   * @param {string} sql - The SQL string for the select operation.
   * @param {Array} params - Parameters for the SQL statement.
   */
  selectOne(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  /**
   * Closes the database connection.
   * @param {function} callback - Optional callback to handle after closure.
   */
  close(callback) {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err.message);
        callback && callback(err);
      } else {
        console.log("Closed the database connection.");
        callback && callback();
      }
    });
  }
}

module.exports = Database;
