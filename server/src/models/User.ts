import { Document, Model, Schema, model } from 'mongoose';

export interface ISessionUser extends Document {
  name: string;
  created: Date;
  expires: Date;
  sessionKey: string;
}

export const SessionUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  created: { type: Date, required: true },
  expires: {type: Date, required: true },
  sessionKey: {type: String, required: true}
});

export const User: Model<ISessionUser> = model<ISessionUser>('User', SessionUserSchema);


