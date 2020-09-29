import { Schema, model, Document } from 'mongoose';

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true, default: '' },
    bio: { type: String, default: '', maxlength: 150 },
    confirmed: { type: Boolean, required: true, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export interface IUser extends Document {
  email: string;
  avatar: string;
  bio: string;
  confirmed: boolean;
  username: string;
  password: string;
  passwordVersion: number;
}

export default model<IUser>('User', schema);
