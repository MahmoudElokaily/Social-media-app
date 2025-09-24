import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { UserDocument } from '../../user/schemas/user.schema';
import { PostPrivacy } from '../enums/post-privacy.enum';
import { MediaType } from '../dto/response-post.dto';


export type PostDocument = HydratedDocument<Post>;



@Schema({timestamps: true})
export class Post {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  author: UserDocument;
  @Prop({default: '#fff'})
  backgroundColor: string;
  @Prop()
  content: string;
  @Prop({default: []})
  mediaFiles: MediaType[];
  @Prop({enum: PostPrivacy , default: PostPrivacy.PUBLIC})
  privacy: PostPrivacy;
  createdAt: Date;
  updatedAt: Date;
}


export const PostSchema = SchemaFactory.createForClass(Post);
