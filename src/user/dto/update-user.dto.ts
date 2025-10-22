
import {
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  name: string;
  @IsOptional()
  @MaxLength(250)
  bio: string;
  @IsOptional()
  @IsDateString()
  birthdate: Date;
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
