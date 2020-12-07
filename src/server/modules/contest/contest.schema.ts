import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '../user/user.schema';
import { ContestItem } from './contest-item.schema';

export type ContestDocument = Contest & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Contest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, alias: 'id' })
  _id: string;
  readonly id: string;

  @Prop({ type: String, required: true })
  thumbnail: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  excerpt: string;

  @Prop({
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User | string;

  @Prop({ type: Number, default: 0 })
  games: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: ContestItem.name }],
  })
  items: ContestItem[];
}

export const ContestSchema = SchemaFactory.createForClass<Contest>(Contest);
