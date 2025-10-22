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
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { ReactionNotificationDto } from './dto/response-notification.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
@TransformDto(ReactionNotificationDto)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(
    @CurrentUser() currentUser: IUserPayload,
    @Query('limit' ,new DefaultValuePipe(10) ,ParseIntPipe) limit: number,
    @Query('cursor') cursor: string,
    ) {
    return this.notificationService.findAll(currentUser,limit,cursor);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() currentUser: IUserPayload) {
    return this.notificationService.markAllRead(currentUser);
  }
}
