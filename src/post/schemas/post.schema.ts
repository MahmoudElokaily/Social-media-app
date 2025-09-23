import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { UserDocument } from '../../user/schemas/user.schema';
import { PostPrivacy } from '../enums/post-privacy.enum';

export type PostDocument = HydratedDocument<Post>;

export class MediaType {
  version: number;
  public_id: string;
  display_name: string;
  format: string;
  resource_type: string;
}

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
}


export const PostSchema = SchemaFactory.createForClass(Post);
