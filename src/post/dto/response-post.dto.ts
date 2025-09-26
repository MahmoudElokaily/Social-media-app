import { PostPrivacy } from '../enums/post-privacy.enum';
import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { ResponseUserDto } from '../../user/dto/response-user.dto';
import { ReactionType } from 'src/_cores/globals/enum';

export class MediaType {
  @Expose()
  @Transform(
    ({ obj }) =>
      `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/v${obj.version}/${obj.display_name}.${obj.format}`)
  url: string;
  @Expose()
  version: number;
  @Expose()
  public_id: string;
  @Expose()
  display_name: string;
  @Expose()
  format: string;
  @Expose()
  resource_type: string;
}


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
}