import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreatePrivateConversationDto {
  @IsNotEmpty()
  @IsMongoId()
  participantsId: string;
}
