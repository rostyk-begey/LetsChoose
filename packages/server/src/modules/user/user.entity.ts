import { UserDto } from '@lets-choose/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User extends UserDto {
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
