import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { UserPreviewDto } from '../../_cores/dto/user-preview.dto';

export class ResponseFriendDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  @Transform(({ obj }) => obj.avatar?.public_id ? obj.avatar.url : null)
  avatarUrl: string | null;
}