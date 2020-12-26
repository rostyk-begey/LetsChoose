import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { ContestItem } from '../contest/contest-item.schema';
import { GameItem } from './game-item.schema';
import { Contest } from '../contest/contest.schema';

export type GameDocument = Game & mongoose.Document;

@Schema()
export class Game {
  @Prop({ type: mongoose.Schema.Types.ObjectId, alias: 'id' })
  _id: string;
  readonly id: string;

  @Prop({
    ref: ContestItem.name,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  contestId: Contest | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ContestItem.name })
  winnerId?: ContestItem | string;

  @Prop([GameItem])
  items?: GameItem[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: ContestItem.name }],
  })
  pair: (ContestItem | string)[];

  @Prop({ type: Number, required: true })
  round: number;

  @Prop({ type: Boolean, required: true, default: false })
  finished: boolean;

  @Prop({ type: Number, required: true })
  totalRounds: number;
}

export const GameSchema = SchemaFactory.createForClass<Game>(Game);
