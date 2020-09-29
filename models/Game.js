const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
    winnerId: { type: Schema.Types.ObjectId, ref: 'ContestItem' },
    items: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: 'ContestItem' },
        wins: { type: Number, required: true },
        compares: { type: Number, required: true },
      },
    ],
    pair: [{ type: Schema.Types.ObjectId, ref: 'ContestItem' }],
    round: { type: Number, required: true },
    finished: { type: Boolean, required: true, default: false },
    totalRounds: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = model('Game', schema);
