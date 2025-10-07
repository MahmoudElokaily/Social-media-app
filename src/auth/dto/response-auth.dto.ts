import { Expose } from 'class-transformer';
import { objectId } from '../../_cores/decorators/object-id.decorator';

export class ResponseAuthDto {
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
  isActive: boolean;
}