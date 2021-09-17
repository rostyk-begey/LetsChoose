import { UserDto } from '@lets-choose/common/dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document<mongoose.Types.ObjectId>;

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

  @Exclude()
  @Prop({ type: Boolean, required: true, default: false })
  confirmed: boolean;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  @Exclude()
  password: string;

  @Prop({ type: Number, default: 0 })
  @Exclude()
  passwordVersion: number;

  constructor({
    password,
    confirmed,
    passwordVersion,
    ...partial
  }: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
