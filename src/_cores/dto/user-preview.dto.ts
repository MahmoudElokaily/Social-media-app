import { Expose, Transform } from 'class-transformer';
import { objectId } from '../decorators/object-id.decorator';

export class UserPreviewDto {
  @Expose()
  @objectId()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }) => obj.avatar?.public_id ? obj.avatar.url : null)
  avatar: string | null;
}
