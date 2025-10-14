import { MediaType } from '../../_cores/dto/media-type.dto';
import { IsOptional } from 'class-validator';

export class UpdateConversationDto  {
  @IsOptional()
  groupName: string;
  @IsOptional()
  groupAvatar: MediaType;
}
