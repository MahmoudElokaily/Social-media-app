import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { ResponseConversationDto } from './dto/response-conversation.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AddParticipantsDto } from './dto/add-participants.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
@TransformDto(ResponseConversationDto)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/private')
  createPrivate(@Body() createPrivateConversationDto: CreatePrivateConversationDto , @CurrentUser() currentUser: IUserPayload) {
    return this.conversationService.createPrivate(createPrivateConversationDto , currentUser);
  }

  @Post('/group')
  create(@Body() createGroupConversationDto: CreateGroupConversationDto , @CurrentUser() currentUser: IUserPayload) {
    return this.conversationService.createGroup(createGroupConversationDto , currentUser);
  }

  @Get()
  findAll(
    @CurrentUser() currentUser: IUserPayload ,
    @Query('limit' , new DefaultValuePipe(10) ,ParseIntPipe) limit: number ,
    @Query('cursor') cursor: string,
  ) {
    return this.conversationService.findAll(currentUser , limit , cursor);
  }

  @Get(':id')
  findOne(@Param('id' , ParseObjectIdPipe) id: string) {
    return this.conversationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateConversationDto: UpdateConversationDto , @CurrentUser() currentUser: IUserPayload ,) {
    return this.conversationService.update(id, updateConversationDto , currentUser);
  }

  @Patch(':id/add-members')
  addParticipants(@CurrentUser() currentUser: IUserPayload,@Param('id' , ParseObjectIdPipe) id: string ,@Body() addParticipantsDto: AddParticipantsDto) {
    return this.conversationService.addParticipants(id , currentUser , addParticipantsDto);
  }
  @Patch(':id/remove-members')
  removeParticipants(@CurrentUser() currentUser: IUserPayload,@Param('id' , ParseObjectIdPipe) id: string ,@Body() removeParticipantsDto: AddParticipantsDto) {
    return this.conversationService.removeParticipants(id , currentUser , removeParticipantsDto);
  }

  @Delete(':id')
  remove(@Param('id' , ParseObjectIdPipe) id: string , @CurrentUser() currentUser: IUserPayload) {
    return this.conversationService.remove(id , currentUser);
  }
}
