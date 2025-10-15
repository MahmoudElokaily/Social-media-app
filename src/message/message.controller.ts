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
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { ResponseMessageDto } from './dto/response-message.dto';

@Controller('messages')
@UseGuards(AuthGuard)
@TransformDto(ResponseMessageDto)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('conversation/:conversationId')
  create(
    @Param('conversationId' , ParseObjectIdPipe) conversationId: string,
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() currentUser: IUserPayload,
    ) {
    return this.messageService.sendMessage(conversationId , sendMessageDto , currentUser);
  }

  @Get(':conversationId')
  findAllMessages(
    @Param('conversationId' , ParseObjectIdPipe) conversationId: string,
    @Query('limit' , new DefaultValuePipe(10) ,ParseIntPipe) limit: number,
    @Query('cursor') cursor: string,
    @CurrentUser() currentUser: IUserPayload
  ) {
    return this.messageService.getAllMessages(conversationId , currentUser , limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id' , ParseObjectIdPipe) id: string) {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id' , ParseObjectIdPipe) id: string, @Body() updateMessageDto: UpdateMessageDto , @CurrentUser() currentUser: IUserPayload) {
    return this.messageService.update(id, updateMessageDto , currentUser);
  }

  @Delete(':id')
  remove(@Param('id' , ParseObjectIdPipe) id: string , @CurrentUser() currentUser: IUserPayload) {
    return this.messageService.remove(id , currentUser);
  }

  @Patch(':id/seen')
  markSeenMessage(@Param('id' , ParseObjectIdPipe) id: string , @CurrentUser() currentUser: IUserPayload) {
    return this.messageService.markSeenMessage(id , currentUser);
  }
}
