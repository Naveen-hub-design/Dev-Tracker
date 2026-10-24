const { getCollection } = require('../config/db');

const Resume = {
  async findOne(query) {
    return getCollection('resumes').findOne(query);
  },

  async findByUserId(userId) {
    return getCollection('resumes').findOne({ userId });
  },

  async create(doc) {
    return getCollection('resumes').create(doc);
  },

  async findOneAndUpdate(query, update, options = { upsert: true }) {
    return getCollection('resumes').findOneAndUpdate(query, update, options);
  },
};

module.exports = Resume;
