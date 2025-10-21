import { Expose, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { Post } from '../../post/schemas/post.schema';
import { SeenByDto } from './response-message.dto';

export class PostResponsePostReaction {
  @Expose()
  @objectId()
  id: string;
  @Expose()
  @objectId()
  post: string;
  @Expose()
  @Type(() => SeenByDto)
  user: SeenByDto
  @Expose()
  type: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}