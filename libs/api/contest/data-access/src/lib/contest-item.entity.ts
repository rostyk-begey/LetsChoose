import { ContestItemDto } from '@lets-choose/common/dto';
import { getMongooseTransformOptions } from '@lets-choose/api/common/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Contest } from './contest.entity';

export type ContestItemDocument = ContestItem & mongoose.Document;

@Schema({
  id: true,
  toObject: getMongooseTransformOptions(),
})
export class ContestItem extends ContestItemDto {
  @Prop({ type: mongoose.Schema.Types.ObjectId, alias: 'id' })
  _id: string;
  readonly id: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, default: 0 })
  games: number;

  @Prop({ type: Number, default: 0 })
  compares: number;

  @Prop({ type: Number, default: 0 })
  wins: number;

  @Prop({ type: Number, default: 0 })
  finalWins: number;

  @Prop({
    ref: Contest.name,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  contestId: string;
}

export const ContestItemSchema = SchemaFactory.createForClass(ContestItem);
