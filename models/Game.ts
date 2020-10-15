import mongoose from 'mongoose';
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { ContestItem } from './ContestItem';
import { Contest } from './Contest';

export class GameItem {
  @prop({
    type: mongoose.Types.ObjectId,
    ref: () => ContestItem,
  })
  itemId!: string;

  @prop({ type: Number, required: true })
  wins!: number;

  @prop({ type: Number, required: true })
  compares!: number;
}

export class Game {
  @prop({ type: mongoose.Types.ObjectId })
  _id!: string;

  @prop({
    ref: () => Contest,
    type: mongoose.Types.ObjectId,
    required: true,
  })
  contestId!: Ref<Contest>;

  @prop({ ref: () => ContestItem, type: mongoose.Types.ObjectId })
  winnerId?: Ref<ContestItem>;

  @prop({ type: () => [GameItem] })
  items!: GameItem[];

  @prop({
    type: () => [mongoose.Types.ObjectId],
    ref: () => ContestItem,
  })
  pair!: Ref<ContestItem>[];

  @prop({ type: Number, required: true })
  round!: number;

  @prop({ type: Boolean, required: true, default: false })
  finished!: boolean;

  @prop({ type: Number, required: true })
  totalRounds!: number;
}

export const GameModel = getModelForClass(Game);
