import { Schema } from 'mongoose';
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { User } from './User';
import { ContestItem } from './ContestItem';

type IContest = Base<string>;
export class Contest extends TimeStamps implements IContest {
  @prop({ type: Schema.Types.ObjectId })
  _id!: string;

  @prop({ type: String, required: true })
  thumbnail!: string;

  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: String, required: true })
  excerpt!: string;

  @prop({ ref: () => User, refType: Schema.Types.ObjectId, required: true })
  author!: Ref<User>;

  @prop({ type: Number, default: 0 })
  games!: number;

  @prop({ ref: () => ContestItem, refType: Schema.Types.ObjectId })
  items!: Ref<ContestItem>[];
}

export const ContestModel = getModelForClass(Contest, {
  schemaOptions: {
    id: true,
    timestamps: true,
  },
});
