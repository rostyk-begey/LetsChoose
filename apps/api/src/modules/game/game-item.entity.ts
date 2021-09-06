import { Prop, Schema } from '@nestjs/mongoose';
import { GameItem as GameItemModel } from '@lets-choose/common/dto';
import mongoose from 'mongoose';

import { ContestItem } from '@modules/contest/contest-item.entity';

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
