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
};

module.exports = User;
