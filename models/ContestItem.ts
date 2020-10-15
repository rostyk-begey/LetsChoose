import mongoose from 'mongoose';
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Contest } from './Contest';

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

  @prop({ ref: 'Contest', type: mongoose.Types.ObjectId, required: true })
  contestId!: Ref<Contest>;
}

export const ContestItemModel = getModelForClass(ContestItem);
