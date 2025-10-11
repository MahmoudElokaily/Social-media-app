import { Expose, Transform } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';

export class ResponseFriendDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  @Transform(({ obj }) => obj.avatar?.public_id ? obj.avatar?.url : null)
  avatarUrl: string;
}