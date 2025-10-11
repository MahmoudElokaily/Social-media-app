import { Expose, Transform } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';

export class ResponseUserDto {
  @Expose()
  @objectId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  role: string;
  @Expose()
  bio: string;
  @Expose()
  birthdate: Date;
  @Expose()
  phoneNumber: string;
  @Expose()
  @Transform(({ obj }) => obj.avatar?.public_id ? obj.avatar?.url : null)
  avaterUrl: string;
  @Expose()
  @Transform(({ obj }) => obj.coverPhoto?.public_id ? obj.coverPhoto?.url : null )
  coverPhotoUrl: string;
  @Expose()
  isActive: boolean;
  @Expose()
  friends: ResponseUserDto[];
}