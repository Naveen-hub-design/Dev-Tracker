const { getCollection } = require('../config/db');

const Certificate = {
  async find(query = {}, options = { sort: 'createdAt DESC' }) {
    return getCollection('certificates').find(query, options);
  },

  async findOne(query) {
    return getCollection('certificates').findOne(query);
  },

  async findById(id) {
    return getCollection('certificates').findById(id);
  },

  async create(doc) {
    return getCollection('certificates').create(doc);
  },

  async findOneAndUpdate(query, update) {
    return getCollection('certificates').findOneAndUpdate(query, update);
  },

  async deleteOne(query) {
    return getCollection('certificates').deleteOne(query);
  },

  async deleteById(id) {
    return getCollection('certificates').deleteById(id);
  },
};

module.exports = Certificate;
