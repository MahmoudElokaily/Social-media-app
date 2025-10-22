import { Expose, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { UserPreviewDto } from '../../_cores/dto/user-preview.dto';

export class ReactionNotificationDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  @Type(() => UserPreviewDto)
  sender: UserPreviewDto;
  @Expose()
  receiver: string;
  @Expose()
  content: string;
  @Expose()
  type: string;
  @Expose()
  isRead: boolean;
  @Expose()
  linkToId: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}