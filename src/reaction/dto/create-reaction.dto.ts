import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { ReactionType } from '../../_cores/globals/enum';

export class CreateReactionDto {
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
  @IsNotEmpty()
  @IsEnum(ReactionType)
  type: ReactionType
}
