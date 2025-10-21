import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { UserPreviewDto } from '../../_cores/dto/user-preview.dto';

export class ResponseMessageDto {
  @Expose()
  @objectId()
  _id: string;

  @Expose()
  @objectId()
  conversation: string;

  @Expose()
  @Transform(({ obj }) => obj.sender?._id)
  senderId: string;

  @Expose()
  @Transform(({ obj }) => obj.sender?.name)
  senderName: string;

  @Expose()
  @Transform(({ obj }) => obj.sender?.avatar?.public_id ? obj.sender.avatar.url : null)
  senderAvatarUrl: string | null;

  @Expose()
  text: string;

  @Expose()
  @Transform(({ obj }) => obj.mediaFiles?.map(file => file.url))
  mediaFiles: string;

  @Expose()
  isDeleted: boolean;

  @Expose()
  @Type(() => UserPreviewDto)
  seenBy: UserPreviewDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
