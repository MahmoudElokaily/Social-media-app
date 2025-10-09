import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { UserDocument } from '../../user/schemas/user.schema';
import { FriendRequestType } from '../../_cores/globals/enum';

export type FriendRequestDocument = HydratedDocument<FriendRequest>;



@Schema({timestamps: true})
export class FriendRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: UserDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver: UserDocument;
  @Prop({ enum: FriendRequestType , default: FriendRequestType.Pending })
  status: FriendRequestType;

}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
