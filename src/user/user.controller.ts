import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { ResponseUserDto } from './dto/response-user.dto';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { RoleGuard } from '../_cores/guards/role.guard';
import { Roles } from '../_cores/decorators/role.decorator';
import { UserRole } from './enums/user-role.enum';

@Controller('users')
@UseGuards(AuthGuard , RoleGuard)
@TransformDto(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseInterceptors(ResponseUserDto)
  getCurrentUser(@CurrentUser() currentUser: IUserPayload) {
    return currentUser;
  }
  @Post()
  @Roles([UserRole.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles([UserRole.ADMIN])
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles([UserRole.ADMIN , UserRole.USER])
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN , UserRole.ADMIN])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
