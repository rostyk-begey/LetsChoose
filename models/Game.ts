import { Schema } from 'mongoose';
import { prop, getModelForClass, Ref, mongoose } from '@typegoose/typegoose';
import { ContestItem } from './ContestItem';

export class GameItem {
  @prop({ type: Schema.Types.ObjectId, ref: 'ContestItem' })
  itemId!: any;

  @prop({ type: Number, required: true })
  wins!: number;

  @prop({ type: Number, required: true })
  compares!: number;
}

export class Game {
  @prop({ type: mongoose.Types.ObjectId })
  _id!: string;

  @prop({ type: Schema.Types.ObjectId, ref: 'Contest', required: true })
  contestId!: string;

  @prop({ type: Schema.Types.ObjectId, ref: 'ContestItem' })
  winnerId?: string;

  @prop({ type: () => [GameItem] })
  items!: Ref<GameItem>[];

  @prop({ type: () => [ContestItem], ref: 'ContestItem' })
  pair!: Ref<ContestItem>[];

  @prop({ type: Number, required: true })
  round!: number;

  @prop({ type: Boolean, required: true, default: false })
  finished!: boolean;

  @prop({ type: Number, required: true })
  totalRounds!: number;
}

export const GameModel = getModelForClass(Game);
