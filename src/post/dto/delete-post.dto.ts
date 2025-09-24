import {
  IsNotEmpty,
} from 'class-validator';

export class DeletePostDto {
  @IsNotEmpty()
  mediaId: string;
}
