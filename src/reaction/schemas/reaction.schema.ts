import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { UserDocument } from '../../user/schemas/user.schema';
import type { PostDocument } from '../../post/schemas/post.schema';
import { ReactionType } from '../../_cores/globals/enum';


export type ReactionDocument = HydratedDocument<Reaction>;


@Schema({timestamps: true})
export class Reaction {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: UserDocument;
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
  post: PostDocument;
  @Prop({enum: ReactionType , default: ReactionType.Like})
  type: ReactionType;
}


export const ReactionSchema = SchemaFactory.createForClass(Reaction);
