import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../user/enums/user-role.enum';

export class SignUpDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: 'role must be one of: admin, user, manager',
  })
  role: string;
}
