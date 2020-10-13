import { Schema } from 'mongoose';
import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';

export class ContestItem {
  @prop({ type: mongoose.Types.ObjectId })
  _id!: string;

  @prop({ type: String, required: true })
  image!: string;

  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: Number, default: 0 })
  games!: number;

  @prop({ type: Number, default: 0 })
  compares!: number;

  @prop({ type: Number, default: 0 })
  wins!: number;

  @prop({ type: Number, default: 0 })
  finalWins!: number;

  @prop({ type: Schema.Types.ObjectId, ref: 'Contest', required: true })
  contestId!: string;
}

export const ContestItemModel = getModelForClass(ContestItem);
