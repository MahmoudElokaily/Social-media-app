import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignIpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
