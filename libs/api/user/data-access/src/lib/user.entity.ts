import { UserPublicDto } from '@lets-choose/common/dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { getMongooseTransformOptions } from '@lets-choose/api/common/utils';

export type UserDocument = User & mongoose.Document<mongoose.Types.ObjectId>;

@Schema({
  id: true,
  toObject: {
    transform: (_, { _id, ...ret }: Partial<User>) => {
      return { _id, id: _id, ...ret };
    },
  },
  toJSON: getMongooseTransformOptions({
    transform: (_, ret: Partial<User>) => {
      delete ret._id;
      delete ret.confirmed;
      delete ret.password;
      delete ret.passwordVersion;
      return ret;
    },
  }),
})
export class User extends UserPublicDto {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
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
