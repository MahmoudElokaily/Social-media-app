import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class AddParticipantsDto {
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({each: true})
  participantIds: string[];
}