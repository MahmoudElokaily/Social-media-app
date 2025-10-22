import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query, DefaultValuePipe,
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
import { DeletePostDto } from './dto/delete-post.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { RemoveReactionDto } from './dto/remove-reaction.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { UploadMediaDto } from '../_cores/dto/upload-media.dto';
import { ResponsePostReaction } from '../message/dto/response-post-reaction.dto';

@Controller('posts')
@UseGuards(AuthGuard , RoleGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Delete('reaction')
  @TransformDto(ResponsePostDto)
  removeReaction(@Body() removeReactionDto: RemoveReactionDto, @CurrentUser() currentUser: IUserPayload) {
    return this.postService.removeReaction(removeReactionDto , currentUser);
  }

  @Post()
  @TransformDto(ResponsePostDto)
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() currentUser: IUserPayload) {
    return this.postService.create(createPostDto , currentUser);
  }

  @Post('reaction')
  @TransformDto(ResponsePostDto)
  addReaction(@Body() addReactionDto: AddReactionDto, @CurrentUser() currentUser: IUserPayload) {
    return this.postService.addReaction(addReactionDto , currentUser);
  }


  @Patch(':id/upload')
  @TransformDto(ResponsePostDto)
  uploadMedia(
    @Param('id' , ParseObjectId) id: string,
    @Body() uploadMediaDto: UploadMediaDto[]) {
    return this.postService.uploadMeda(id , uploadMediaDto)
  }

  @Delete(':id/delete')
  @TransformDto(ResponsePostDto)
  deleteMedia(
    @Param('id' , ParseObjectId) id: string,
    @Body() deletePostDto: DeletePostDto) {
    return this.postService.deleteMedia(id , deletePostDto)
  }

  @Get()
  @TransformDto(ResponsePostDto)
  findAll(@CurrentUser() currentUser: IUserPayload,@Query('limit' ,new DefaultValuePipe(10) ,ParseIntPipe) limit: number, @Query('cursor') cursor: string) {
    return this.postService.findAll(currentUser , limit , cursor);
  }

  @Get(':id')
  @TransformDto(ResponsePostDto)
  findOne(@Param('id' , ParseObjectIdPipe) id: string,@CurrentUser() currentUser: IUserPayload) {
    return this.postService.findOneWithMyReaction(id , currentUser);
  }
  @Get(':id/reactions')
  @TransformDto(ResponsePostReaction)
  findOneWithReactions(@Param('id' , ParseObjectIdPipe) id: string) {
    return this.postService.findPostReactions(id);
  }

  @Patch(':id')
  @TransformDto(ResponsePostDto)
  @Roles([UserRole.ADMIN , UserRole.USER])
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }
  @Patch('replace-media')
  @TransformDto(ResponsePostDto)
  @Roles([UserRole.ADMIN , UserRole.USER])
  replaceMedia(@Param('id') id: string, @Body() uploadMediaDtos: UploadMediaDto[]) {
    return this.postService.replaceMedia(id, uploadMediaDtos);
  }

  @Delete(':id')
  @TransformDto(ResponsePostDto)
  remove(@Param('id' , ParseObjectId) id: string) {
    return this.postService.remove(id);
  }
}
