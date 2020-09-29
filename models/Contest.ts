import { Schema, model, Document } from 'mongoose';

import { IUser } from './User';

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

export interface IContest extends Document {
  thumbnail: string;
  title: string;
  excerpt: string;
  author: string | IUser;
  games: number;
  items: any[];
}

export default model<IContest>('Contest', schema);
