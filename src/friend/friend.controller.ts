import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AuthGuard } from '../_cores/guards/auth.guard';
import { TransformDto } from '../_cores/interceptors/transform-dto.interceptor';
import { ResponseFriendDto } from './dto/response-friend.dto';

@Controller('friends')
@UseGuards(AuthGuard)
@TransformDto(ResponseFriendDto)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('request/:receiverId')
  sendFriendRequest(@CurrentUser() currentUser: IUserPayload ,@Param('receiverId' , ParseObjectIdPipe) receiverId: string) {
    return this.friendService.create(currentUser , receiverId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('cansel-request/:receiverId')
  canselFriendRequest(@CurrentUser() currentUser: IUserPayload ,@Param('receiverId' , ParseObjectIdPipe) receiverId: string) {
    return this.friendService.remove(currentUser , receiverId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('accept-request/:friendRequestId')
  acceptFriendRequest(@CurrentUser() currentUser: IUserPayload ,@Param('friendRequestId' , ParseObjectIdPipe) friendRequestId: string) {
    return this.friendService.acceptFriendRequest(currentUser , friendRequestId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reject-request/:friendRequestId')
  rejectFriendRequest(@CurrentUser() currentUser: IUserPayload ,@Param('friendRequestId' , ParseObjectIdPipe) friendRequestId: string) {
    return this.friendService.rejectFriendRequest(currentUser , friendRequestId);
  }


  @Get('friend-request-pending')
  getCurrentRequestPending(@CurrentUser() currentUser: IUserPayload) {
    return this.friendService.getCurrentRequestPending(currentUser);
  }

  @Get('')
  getCurrentFriends(@CurrentUser() currentUser: IUserPayload) {
    return this.friendService.getCurrentFriends(currentUser);
  }
}
