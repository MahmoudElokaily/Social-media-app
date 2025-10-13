import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { MediaType } from '../../_cores/dto/media-type.dto';

export class CreateGroupConversationDto {
  @IsArray()
  @IsMongoId({each: true})
  participantsIds: string[];
  @IsOptional()
  groupAvatar: MediaType;
  @IsNotEmpty()
  groupName: string;
}
