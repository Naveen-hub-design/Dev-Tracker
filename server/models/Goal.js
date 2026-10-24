const { getCollection } = require('../config/db');

const Goal = {
  async findOne(query) {
    return getCollection('goals').findOne(query);
  },

  async findByUserId(userId) {
    return getCollection('goals').findOne({ userId });
  },

  async create(doc) {
    return getCollection('goals').create(doc);
  },

  async findOneAndUpdate(query, update, options = { upsert: true }) {
    return getCollection('goals').findOneAndUpdate(query, update, options);
  },
};

module.exports = Goal;
