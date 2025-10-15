import { MediaType } from '../../_cores/dto/media-type.dto';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  text: string;
  @IsOptional()
  @IsArray()
  mediaFiles: MediaType[];
}
