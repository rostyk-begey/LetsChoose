import { Schema } from 'mongoose';
import { prop, getModelForClass, mongoose, Ref } from '@typegoose/typegoose';
import { Contest } from './Contest';

export class ContestItem {
  @prop({ type: Schema.Types.ObjectId })
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

  @prop({ ref: () => Contest, refType: Schema.Types.ObjectId, required: true })
  contestId!: Ref<Contest>;
}

export const ContestItemModel = getModelForClass(ContestItem);
