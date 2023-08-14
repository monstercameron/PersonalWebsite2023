const bcrypt = require("bcrypt");

// Number of rounds for bcrypt hashing. Higher values increase security but also hashing time.
const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {string} - The hashed password.
 */
const hashPassword = (password) => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

/**
 * Checks if a password matches a hash.
 * @param {string} password - The password to check.
 * @param {string} hash - The hash to compare against.
 * @returns {boolean} - True if the password matches the hash, false otherwise.
 */
const checkPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = { hashPassword, checkPassword };
