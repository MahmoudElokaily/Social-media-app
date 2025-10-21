import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { RoleGuard } from '../_cores/guards/role.guard';
import { Roles } from '../_cores/decorators/role.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@Controller('comments')
@UseGuards(AuthGuard, RoleGuard)
@TransformDto(ResponseCommentDto)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.commentService.create(createCommentDto, currentUser);
  }

  @Get('post/:postId')
  getComments(@Param('postId', ParseObjectIdPipe) postId: string) {
    return this.commentService.getComments(postId);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN , UserRole.USER])
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN , UserRole.USER])
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.commentService.remove(id);
  }
}
