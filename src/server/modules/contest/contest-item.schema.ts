import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { Contest } from './contest.schema';

export type ContestItemDocument = ContestItem & mongoose.Document;

@Schema()
export class ContestItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, alias: 'id' })
  _id: string;
  readonly id: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, default: 0 })
  games: number;

  @Prop({ type: Number, default: 0 })
  compares: number;

  @Prop({ type: Number, default: 0 })
  wins: number;

  @Prop({ type: Number, default: 0 })
  finalWins: number;

  @Prop({
    ref: 'Contest',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  contestId: Contest | string;
}

export const ContestItemSchema = SchemaFactory.createForClass(ContestItem);
