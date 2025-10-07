import { Expose, Transform } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';
import { MediaType } from '../../_cores/dto/media-type.dto';

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
  // @Expose()
  // avatar: MediaType;
  // @Expose()
  // coverPhoto: MediaType;
  @Expose()
  birthdate: Date;
  @Expose()
  phoneNumber: string;
  @Expose()
  @Transform(({ obj }) => obj.avatar?.url)
  avaterUrl: string;
  @Expose()
  @Transform(({ obj }) => obj.coverPhoto?.url)
  coverPhotoUrl: string;
  @Expose()
  isActive: boolean;
}