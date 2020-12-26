import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, alias: 'id' })
  _id: string;
  readonly id: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, default: '' })
  avatar: string;

  @Prop({ type: String, default: '', maxlength: 150 })
  bio?: string;

  @Prop({ type: Boolean, required: true, default: false })
  confirmed: boolean;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, default: 0 })
  passwordVersion: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
