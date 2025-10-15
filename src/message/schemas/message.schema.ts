import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { ConversationDocument } from '../../conversation/schemas/conversation.schema';
import type { UserDocument } from '../../user/schemas/user.schema';
import { MediaType } from '../../_cores/dto/media-type.dto';


export type MessageDocument = HydratedDocument<Message>;


@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversation: ConversationDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: UserDocument;
  @Prop()
  text: string;
  @Prop()
  mediaFiles?: MediaType[];
  @Prop({ default: false })
  isDeleted: boolean;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  seenBy: UserDocument[];
  createdAt: Date;
  updatedAt: Date;
}


export const MessageSchema = SchemaFactory.createForClass(Message);
