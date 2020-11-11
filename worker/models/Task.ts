import mongoose from 'mongoose';
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { User } from './User';

export enum Status {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
}

type ITask = Base<string>;
export class Task extends TimeStamps implements ITask {
  @prop({ type: mongoose.Types.ObjectId, alias: 'id' })
  _id!: string;
  readonly id!: string;

  @prop({ type: String, required: true })
  title!: string;

  @prop({ ref: () => User, type: mongoose.Types.ObjectId, required: true })
  user!: Ref<User>;

  @prop({ type: String, required: true })
  challenge!: string;

  @prop({ type: Number, required: true })
  hardness!: number;

  @prop({ type: String })
  solution?: string;

  @prop({ type: String })
  status!: string;
}

export const TaskModel = getModelForClass(Task, {
  schemaOptions: {
    id: true,
    timestamps: true,
  },
});
