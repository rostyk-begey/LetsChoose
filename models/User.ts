import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';

export class User {
  @prop({ type: mongoose.Types.ObjectId })
  _id!: string;

  @prop({ type: String, required: true, unique: true })
  email!: string;

  @prop({ type: String, required: true, default: '' })
  avatar!: string;

  @prop({ type: String, default: '', maxlength: 150 })
  bio?: string;

  @prop({ type: Boolean, required: true, default: false })
  confirmed!: boolean;

  @prop({ type: String, required: true, unique: true })
  username!: string;

  @prop({ type: String, required: true })
  password!: string;

  @prop({ type: Number, default: 0 })
  passwordVersion!: number;
}

export default getModelForClass(User);
