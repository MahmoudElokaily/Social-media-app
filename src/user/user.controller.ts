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

@Controller('users')
@UseGuards(AuthGuard)
@TransformDto(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseInterceptors(ResponseUserDto)
  getCurrentUser(@CurrentUser() currentUser: IUserPayload) {
    return currentUser;
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
