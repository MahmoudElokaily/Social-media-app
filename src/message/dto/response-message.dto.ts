import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';

export class SeenByDto {
  @Expose()
  @objectId()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }) => obj.avatar?.public_id ? obj.avatar.url : null)
  avatar: string | null;
}

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
  @Type(() => SeenByDto)
  seenBy: SeenByDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
