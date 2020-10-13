import { Schema, Types } from 'mongoose';
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { User } from './User';
import { ContestItem } from './ContestItem';

type IContest = Base<string>;
export class Contest extends TimeStamps implements IContest {
  @prop({ type: Types.ObjectId })
  _id!: string;

  @prop({ type: String, required: true })
  thumbnail!: string;

  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: String, required: true })
  excerpt!: string;

  @prop({ type: Schema.Types.ObjectId, ref: 'User', required: true })
  author!: Ref<User>;

  @prop({ type: Number, default: 0 })
  games!: number;

  @prop({ type: Schema.Types.ObjectId, ref: 'ContestItem' })
  items!: Ref<ContestItem>[];
}

export const ContestModel = getModelForClass(Contest, {
  schemaOptions: {
    id: true,
    timestamps: true,
  },
});
