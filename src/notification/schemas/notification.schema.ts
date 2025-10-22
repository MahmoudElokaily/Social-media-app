import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import type { UserDocument } from '../../user/schemas/user.schema';
import { NotificationType } from '../../_cores/globals/enum';


export type NotificationDocument = HydratedDocument<Notification>;


@Schema({timestamps: true})
export class Notification {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  sender: UserDocument;
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  receiver: UserDocument;
  @Prop()
  type: string;
  @Prop()
  content: string;
  @Prop({default: false})
  isRead: boolean;
  @Prop({ enum: NotificationType })
  linkToId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


export const NotificationSchema = SchemaFactory.createForClass(Notification);
