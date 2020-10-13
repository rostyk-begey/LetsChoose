import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

type IContest = Base<string>;
export class User extends TimeStamps implements IContest {
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

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    id: true,
    timestamps: true,
  },
});
