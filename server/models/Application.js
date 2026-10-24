const { getCollection } = require('../config/db');

const Application = {
  async find(query = {}, options = { sort: 'updatedAt DESC' }) {
    return getCollection('applications').find(query, options);
  },

  async findOne(query) {
    return getCollection('applications').findOne(query);
  },

  async findById(id) {
    return getCollection('applications').findById(id);
  },

  async create(doc) {
    return getCollection('applications').create(doc);
  },

  async findOneAndUpdate(query, update) {
    return getCollection('applications').findOneAndUpdate(query, update);
  },

  async deleteOne(query) {
    return getCollection('applications').deleteOne(query);
  },

  async deleteById(id) {
    return getCollection('applications').deleteById(id);
  },
};

module.exports = Application;
