import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { ContestItem } from '../contest/contest-item.schema';

@Schema()
export class GameItem {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: ContestItem,
  })
  contestItem: ContestItem | string;

  @Prop({ type: Number, required: true })
  wins: number;

  @Prop({ type: Number, required: true })
  compares: number;
}
