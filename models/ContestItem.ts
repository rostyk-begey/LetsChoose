import { Schema, model, Document } from 'mongoose';

const schema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  games: { type: Number, default: 0 },
  compares: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  finalWins: { type: Number, default: 0 },
  contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
});

export interface IContestItem extends Document {
  image: string;
  title: string;
  games: number;
  compares: number;
  wins: number;
  finalWins: number;
  contestId: string;
}

export default model<IContestItem>('ContestItem', schema);
