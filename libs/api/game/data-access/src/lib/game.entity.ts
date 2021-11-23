import { Contest, ContestItem } from '@lets-choose/api/contest/data-access';
import { GameDto } from '@lets-choose/common/dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { getMongooseTransformOptions } from '@lets-choose/api/common/utils';
import { GameItem } from './game-item.entity';

export type GameDocument = Game & mongoose.Document;

@Schema({
  id: true,
  toObject: getMongooseTransformOptions(),
})
export class Game implements GameDto {
  @Prop()
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
