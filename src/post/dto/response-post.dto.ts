import { PostPrivacy } from '../enums/post-privacy.enum';
import { Expose, Transform, Type } from 'class-transformer';
import { log } from 'node:util';
import { UserDocument } from '../../user/schemas/user.schema';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { ResponseUserDto } from '../../user/dto/response-user.dto';

export class ResponsePostDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  backgroundColor: string;
  @Expose()
  content: string;
  @Expose()
  mediaUrls: string[];
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