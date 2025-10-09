import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';
import { FriendRequestType } from '../_cores/globals/enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AuthGuard } from '../_cores/guards/auth.guard';

@Controller('friends')
@UseGuards(AuthGuard)
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


  @Get()
  findAll() {
    return this.friendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto);
  }
}
