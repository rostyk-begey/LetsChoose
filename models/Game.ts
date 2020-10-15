import mongoose from 'mongoose';
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import 'reflect-metadata';

import { ContestItem } from './ContestItem';
import { GameItem } from './GameItem';
import { Contest } from './Contest';

export class Game {
  @prop({ type: mongoose.Types.ObjectId })
  _id?: string;

  @prop({
    ref: () => Contest,
    type: mongoose.Types.ObjectId,
    required: true,
  })
  contestId!: Ref<Contest>;

  @prop({ ref: () => ContestItem, type: mongoose.Types.ObjectId })
  winnerId?: Ref<ContestItem>;

  @prop({ type: () => [GameItem], _id: false })
  items?: Ref<GameItem>[];

  @prop({ ref: () => ContestItem })
  pair!: Ref<ContestItem>[];

  @prop({ type: Number, required: true })
  round!: number;

  @prop({ type: Boolean, required: true, default: false })
  finished!: boolean;

  @prop({ type: Number, required: true })
  totalRounds!: number;
}

export const GameModel = getModelForClass(Game);
