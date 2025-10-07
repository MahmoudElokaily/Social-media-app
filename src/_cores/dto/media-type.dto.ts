import { Expose, Transform } from 'class-transformer';

export class MediaType {
  @Expose()
  @Transform(
    ({ obj }) =>
      `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/v${obj.version}/${obj.display_name}.${obj.format}`)
  url: string;
  @Expose()
  version: number;
  @Expose()
  public_id: string;
  @Expose()
  display_name: string;
  @Expose()
  format: string;
  @Expose()
  resource_type: string;
}