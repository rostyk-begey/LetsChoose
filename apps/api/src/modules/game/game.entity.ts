import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Game as GameModel } from '@lets-choose/common/dto';
import mongoose from 'mongoose';

import { Contest } from '../../../../../libs/api/contest/data-access/src/lib/contest.entity';
import { ContestItem } from '../../../../../libs/api/contest/data-access/src/lib/contest-item.entity';
import { GameItem } from '@modules/game/game-item.entity';

export type GameDocument = Game & mongoose.Document;

@Schema()
export class Game implements GameModel {
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

  @Prop({ type: Number, required: true })
  pairNumber: number;

  @Prop({ type: Number, required: true })
  pairsInRound: number;

  @Prop({ type: Boolean, required: true, default: false })
  finished: boolean;

  @Prop({ type: Number, required: true })
  totalRounds: number;
}

export const GameSchema = SchemaFactory.createForClass<Game>(Game);
