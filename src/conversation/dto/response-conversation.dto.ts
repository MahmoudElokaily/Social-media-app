import { Expose, Transform, Type } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import type { UserDocument } from '../../user/schemas/user.schema';

export class ParticipantDto {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  @Transform(({ obj }) => obj.avatar?.public_id ? obj.avatar?.url : null)
  groupAvatar: string;
  avatarUrl: string;
}

export class ResponseConversationDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  isGroup: boolean;
  @Expose()
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];
  @Expose()
  groupId: string;
  @Expose()
  @Transform(({obj}) => obj?.groupOwner?._id)
  groupOwnerId: string;
  @Expose()
  @Transform(({obj}) => obj?.groupOwner?.name)
  groupOwnerName: string;
  @Expose()
  @Transform(({obj}) => obj?.groupOwner?.email)
  groupOwnerEmail: string;
  @Expose()
  groupName: string;
  @Expose()
  @Transform(({ obj }) => obj.groupAvatar?.public_id ? obj.groupAvatar?.url : null)
  groupAvatar: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}