import { PostPrivacy } from '../enums/post-privacy.enum';
import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { ResponseUserDto } from '../../user/dto/response-user.dto';
import { ReactionType } from 'src/_cores/globals/enum';
import { MediaType } from '../../_cores/dto/media-type.dto';

export class ResponsePostDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  backgroundColor: string;
  @Expose()
  content: string;
  @Expose()
  @Type(() => MediaType)
  mediaFiles: MediaType[];
  @Expose()
  @Transform(({ obj }) => obj.reactionCounts)
  reactionCounts: Map<ReactionType, number>;
  @Expose()
  privacy: PostPrivacy;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  @Type(() => ResponseUserDto)
  author: ResponseUserDto;
  @Expose()
  myReaction: ReactionType;
}