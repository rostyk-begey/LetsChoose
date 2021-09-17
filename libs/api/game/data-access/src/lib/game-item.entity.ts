import { ContestItem } from '@lets-choose/api/contest/data-access';
import { GameItem as GameItemModel } from '@lets-choose/common/dto';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class GameItem implements GameItemModel {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: () => ContestItem,
  })
  contestItem: ContestItem | string;

  @Prop({ type: Number, required: true })
  wins: number;

  @Prop({ type: Number, required: true })
  compares: number;
}
