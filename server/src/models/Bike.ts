import { Document, Model, Schema, model } from 'mongoose';

import {ISessionUser} from './User'

export interface IBike extends Document {
  name: string;
  latitude: number;
  longitude: number;
  rented: boolean;
  user?: ISessionUser;
}

const BikeSchema: Schema = new Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    rented: { type: Boolean, required: true },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: function(){
            return this.rented
        }
    }
});

export const Bike: Model<IBike> = model<IBike>('Bike', BikeSchema);

