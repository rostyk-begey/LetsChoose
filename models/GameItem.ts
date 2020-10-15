import mongoose from 'mongoose';
import { prop, Ref } from '@typegoose/typegoose';
import { ContestItem } from './ContestItem';

export class GameItem {
  @prop({
    type: mongoose.Types.ObjectId,
    ref: () => ContestItem,
  })
  contestItem!: Ref<ContestItem>;

  @prop({ type: Number, required: true })
  wins!: number;

  @prop({ type: Number, required: true })
  compares!: number;
}
