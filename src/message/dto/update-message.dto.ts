import { IsOptional } from 'class-validator';
import { MediaType } from '../../_cores/dto/media-type.dto';

export class UpdateMessageDto {
  @IsOptional()
  text:string;
  @IsOptional()
  mediaFiles: MediaType[];
}
