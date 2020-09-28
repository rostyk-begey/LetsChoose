const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    thumbnail: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    games: { type: Number, default: 0 },
    // tags: [{ type: String }],
    items: [{ type: Schema.Types.ObjectId, ref: 'ContestItem' }],
  },
  { timestamps: true },
);

module.exports = model('Contest', schema);
