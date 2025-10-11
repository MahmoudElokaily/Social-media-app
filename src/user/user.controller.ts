import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Post,
  Query,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { ResponseUserDto } from './dto/response-user.dto';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { RoleGuard } from '../_cores/guards/role.guard';
import { Roles } from '../_cores/decorators/role.decorator';
import { UserRole } from './enums/user-role.enum';
import { ParseObjectId } from '../_cores/pipes/parse-object-id';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { UploadMediaDto } from '../_cores/dto/upload-media.dto';

@Controller('users')
@UseGuards(AuthGuard , RoleGuard)
@TransformDto(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseInterceptors(ResponseUserDto)
  getCurrentUser(@CurrentUser() currentUser: IUserPayload) {
    return this.userService.getCurrentUser(currentUser);
  }

  @Post('upload-avatar')
  uploadAvatar(@Body() uploadMediaDto: UploadMediaDto, @CurrentUser() currentUser: IUserPayload) {
    return this.userService.uploadAvatar(uploadMediaDto , currentUser);
  }

  @Post('upload-cover')
  uploadCoverPhoto(@Body() uploadMediaDto: UploadMediaDto, @CurrentUser() currentUser: IUserPayload) {
    return this.userService.uploadCoverPhoto(uploadMediaDto , currentUser);
  }


  @Get()
  @Roles([UserRole.ADMIN])
  findAll(
    @Query('q') q: string ,
    @Query('limit' , new DefaultValuePipe(10) , ParseIntPipe) limit: number ,
    @Query('cursor') cursor: string
    ) {
    return this.userService.findAll(q , limit, cursor);
  }

  @Get(':id')
  @Roles([UserRole.ADMIN , UserRole.USER])
  findOne(@Param('id' , ParseObjectId) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN , UserRole.USER])
  update(@Param('id', ParseObjectId) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id' , ParseObjectIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
