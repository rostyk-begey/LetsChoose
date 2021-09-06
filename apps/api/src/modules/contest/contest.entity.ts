import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Contest as ContestModel } from '@lets-choose/common/dto';
import mongoose from 'mongoose';

import { User } from '../user/user.entity';
import { ContestItem } from '@modules/contest/contest-item.entity';

export type ContestDocument = Contest & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Contest extends ContestModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, alias: 'id' })
  _id: string;
  readonly id: string;

  @Prop({ type: String, required: true })
  thumbnail: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, default: '' })
  excerpt: string;

  @Prop({
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  author: User | string;

  @Prop({ type: Number, default: 0 })
  games: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => ContestItem }],
  })
  items: ContestItem[];

  readonly createdAt: string;
}

export const ContestSchema = SchemaFactory.createForClass<Contest>(Contest);

ContestSchema.index({ games: -1 });
