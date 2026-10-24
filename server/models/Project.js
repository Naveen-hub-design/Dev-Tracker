const { getCollection } = require('../config/db');

const Project = {
  async find(query = {}, options = { sort: 'updatedAt DESC' }) {
    return getCollection('projects').find(query, options);
  },

  async findOne(query) {
    return getCollection('projects').findOne(query);
  },

  async findById(id) {
    return getCollection('projects').findById(id);
  },

  async create(doc) {
    return getCollection('projects').create(doc);
  },

  async findOneAndUpdate(query, update) {
    return getCollection('projects').findOneAndUpdate(query, update);
  },

  async deleteOne(query) {
    return getCollection('projects').deleteOne(query);
  },

  async deleteById(id) {
    return getCollection('projects').deleteById(id);
  },
};

module.exports = Project;
