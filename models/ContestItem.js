const { Schema, model } = require('mongoose');

const schema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  votes: { type: Number, required: true, default: 0 },
  contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
});

module.exports = model('ContestItem', schema);
