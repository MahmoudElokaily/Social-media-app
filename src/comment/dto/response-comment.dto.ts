import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { ResponseUserDto } from '../../user/dto/response-user.dto';

export class ResponseCommentDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  @objectId()
  @Transform(({obj}) => obj.post)
  post: string;
  @Expose()
  @objectId()
  @Transform(({obj}) => (obj?.parent) ? obj?.parent : null)
  parent: string;
  @Expose()
  @Type(() => ResponseUserDto)
  userComment: ResponseUserDto;
  @Expose()
  @Type(() => ResponseUserDto)
  replyToUser: ResponseUserDto;
  @Expose()
  content: string;
  @Expose()
  @Type(() => ResponseUserDto)
  replies: ResponseCommentDto[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;


}