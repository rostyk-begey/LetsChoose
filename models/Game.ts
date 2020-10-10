import { Schema } from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';

export class GameItem {
  @prop({ type: Schema.Types.ObjectId, ref: 'ContestItem' })
  itemId!: any;

  @prop({ type: Number, required: true })
  wins!: number;

  @prop({ type: Number, required: true })
  compares!: number;
}

export class Game {
  @prop({ type: Schema.Types.ObjectId, ref: 'Contest', required: true })
  contestId!: string;

  @prop({ type: Schema.Types.ObjectId, ref: 'ContestItem' })
  winnerId?: string;

  @prop({ type: () => [GameItem] })
  items!: GameItem[];

  @prop({ type: Schema.Types.ObjectId, ref: 'ContestItem' })
  pair!: string[];

  @prop({ type: Number, required: true })
  round!: number;

  @prop({ type: Boolean, required: true, default: false })
  finished!: boolean;

  @prop({ type: Number, required: true })
  totalRounds!: number;
}

export default getModelForClass(Game);
