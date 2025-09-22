import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { RoleGuard } from '../_cores/guards/role.guard';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { ResponsePostDto } from './dto/response-post.dto';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { Roles } from '../_cores/decorators/role.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { ParseObjectId } from '../_cores/pipes/parse-object-id';

@Controller('posts')
@TransformDto(ResponsePostDto)
@UseGuards(AuthGuard , RoleGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() currentUser: IUserPayload) {
    return this.postService.create(createPostDto , currentUser);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN , UserRole.USER])
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id' , ParseObjectId) id: string) {
    return this.postService.remove(id);
  }
}
