const { getCollection, db } = require('../config/db');

const DailyStreak = {
  async findOne(query) {
    return getCollection('daily_streaks').findOne(query);
  },

  async findByUserId(userId) {
    return getCollection('daily_streaks').find({ userId }, { sort: 'date DESC' });
  },

  async findByUserAndDate(userId, date) {
    return getCollection('daily_streaks').findOne({ userId, date });
  },

  async create(doc) {
    return getCollection('daily_streaks').create(doc);
  },

  async findOneAndUpdate(query, update, options = { upsert: true }) {
    return getCollection('daily_streaks').findOneAndUpdate(query, update, options);
  },

  async deleteOne(query) {
    return getCollection('daily_streaks').deleteOne(query);
  },

  /**
   * Get all solved dates for a user sorted ascending
   */
  getSolvedDates(userId) {
    const rows = db
      .prepare('SELECT date FROM daily_streaks WHERE userId = ? AND solved = 1 ORDER BY date ASC')
      .all(userId);
    return rows.map((r) => r.date);
  },

  /**
   * Get all streak records for a user in the last N days
   */
  getRecentStreaks(userId, limit = 30) {
    return db
      .prepare('SELECT * FROM daily_streaks WHERE userId = ? ORDER BY date DESC LIMIT ?')
      .all(userId, limit);
  },
};

module.exports = DailyStreak;
