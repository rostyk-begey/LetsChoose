const { Schema, model } = require('mongoose');

const schema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  games: { type: Number, default: 0 },
  compares: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  finalWins: { type: Number, default: 0 },
  contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
});

module.exports = model('ContestItem', schema);
