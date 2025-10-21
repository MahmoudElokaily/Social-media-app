import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { UserPreviewDto } from '../../_cores/dto/user-preview.dto';

export class ResponseFriendRequestDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  @Type(() => UserPreviewDto)
  sender: UserPreviewDto;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}