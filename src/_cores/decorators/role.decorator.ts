import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/enums/user-role.enum';

export const Roles = Reflector.createDecorator<UserRole[]>();
