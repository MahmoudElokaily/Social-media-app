import { Expose, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { UserPreviewDto } from '../../_cores/dto/user-preview.dto';

export class ResponsePostReaction {
  @Expose()
  @objectId()
  id: string;
  @Expose()
  @objectId()
  post: string;
  @Expose()
  @Type(() => UserPreviewDto)
  user: UserPreviewDto;
  @Expose()
  type: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}