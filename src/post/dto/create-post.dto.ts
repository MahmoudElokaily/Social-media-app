import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostPrivacy } from '../enums/post-privacy.enum';

export class CreatePostDto {
  @IsOptional()
  @IsHexColor()
  backgroundColor: string;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsOptional()
  @IsEnum(PostPrivacy)
  privacy: PostPrivacy;
}
