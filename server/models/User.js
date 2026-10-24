const bcrypt = require('bcryptjs');
const { getCollection } = require('../config/db');

const User = {
  async findOne(query) {
    return await getCollection('users').findOne(query);
  },

  async findById(id) {
    return await getCollection('users').findById(id);
  },

  async create({ name, email, password }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return await getCollection('users').create({ name, email, password: hashedPassword });
  },

  async findOneAndUpdate(query, update) {
    return await getCollection('users').findOneAndUpdate(query, update);
  },

  async findByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim();
    const { db } = require('../config/db');
    const row = db.prepare(`
      SELECT _id FROM users
      WHERE githubUsername = ? COLLATE NOCASE
         OR leetcodeUsername = ? COLLATE NOCASE
         OR codeforcesUsername = ? COLLATE NOCASE
         OR name = ? COLLATE NOCASE
         OR _id = ?
      LIMIT 1
    `).get(clean, clean, clean, clean, clean);
    if (!row) return null;
    return await getCollection('users').findById(row._id);
  },
};

module.exports = User;
