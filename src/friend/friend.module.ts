import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestSchema,
} from './schemas/friend-request.schema';
import { UserModule } from '../user/user.module';
import { FriendGateway } from './friend.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    UserModule
  ],
  controllers: [FriendController],
  providers: [FriendService, FriendGateway],
})
export class FriendModule {}
