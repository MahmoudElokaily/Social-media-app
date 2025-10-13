import mongoose, { HydratedDocument } from 'mongoose';
import type { UserDocument } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MediaType } from '../../_cores/dto/media-type.dto';
import type { MessageDocument } from '../../message/schemas/message.schema';


export type ConversationDocument = HydratedDocument<Conversation>;


@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  participants: UserDocument[];
  @Prop({ default: false })
  isGroup: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  groupOwner?: UserDocument;
  @Prop()
  groupAvatar?: MediaType;
  @Prop()
  groupName?: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  lastMessage?: MessageDocument;
  createdAt: Date;
  updatedAt: Date;
}


export const ConversationSchema = SchemaFactory.createForClass(Conversation);
