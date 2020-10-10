import { Schema } from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';

import { User } from './User';
import { ContestItem } from './ContestItem';

export class Contest {
  @prop({ type: String, required: true })
  thumbnail!: string;

  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: String, required: true })
  excerpt!: string;

  @prop({ type: Schema.Types.ObjectId, ref: 'User', required: true })
  author!: string | Partial<User>;

  @prop({ type: Number, default: 0 })
  games!: number;

  @prop({ type: Schema.Types.ObjectId, ref: 'ContestItem' })
  items!: ContestItem[];
}

export default getModelForClass(Contest);
