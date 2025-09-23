import {
  IsNotEmpty,
} from 'class-validator';
import { MediaType } from '../schemas/post.schema';

export class DeletePostDto {
  @IsNotEmpty()
  mediaId: string;
}
