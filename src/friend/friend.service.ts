import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schemas/friend-request.schema';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { FriendRequestType } from '../_cores/globals/enum';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(FriendRequest.name) private friendModel: Model<FriendRequest>,
    private userService: UserService
  )
  {}
  async create(currentUser: IUserPayload , receiverId: string) {
    // receiver user exist
    const receiver = await this.userService.findOne(receiverId);
    // prevent send request to yourself
    if (currentUser._id === receiver._id.toString()) throw new BadRequestException('Cannot send a friend request to yourself');
    // prevent duplicate the same friend request
    const existingFriendRequest = await this.friendModel.findOne({
      sender: currentUser._id ,
      receiver: receiver._id ,
      status: { $in: [FriendRequestType.Pending , FriendRequestType.Accept]}
    });

    if (existingFriendRequest) throw new BadRequestException('The friend request already sent');

    const friendRequest =  new this.friendModel({
      sender: currentUser._id ,
      receiver: receiver._id ,
      status: FriendRequestType.Pending
    });

    return friendRequest.save();

  }

  async acceptFriendRequest(currentUser: IUserPayload,FriendRequestId: string) {
    const friendRequest = await this.friendModel.findById(FriendRequestId);
    if (!friendRequest) throw new NotFoundException('Friend request does not exist');
    if (friendRequest.status !== FriendRequestType.Pending) throw new BadRequestException('Friend request already handled');
    if (currentUser._id !== friendRequest.receiver._id.toString()) throw new ForbiddenException();

    friendRequest.status = FriendRequestType.Accept;
    await friendRequest.save();

    await this.userService.addFriend(friendRequest.sender._id.toString() , friendRequest.receiver._id.toString());
    await this.userService.addFriend(friendRequest.receiver._id.toString() , friendRequest.sender._id.toString());
  }
  async rejectFriendRequest(currentUser: IUserPayload,FriendRequestId: string) {
    const friendRequest = await this.friendModel.findById(FriendRequestId);
    if (!friendRequest) throw new NotFoundException('Friend request does not exist');
    if (friendRequest.status !== FriendRequestType.Pending) throw new BadRequestException('Friend request already handled');
    if (currentUser._id !== friendRequest.receiver._id.toString()) throw new ForbiddenException();

    friendRequest.status = FriendRequestType.Reject;
    await friendRequest.save();

  }

   getCurrentRequestPending(currentUser: IUserPayload) {
    return this.friendModel.find({
      receiver: currentUser._id,
      status: FriendRequestType.Pending
    }).populate([
      { path: 'sender' , select: 'name email avatar' },
      { path: 'receiver' , select: 'name email avatar'},
    ]);
  }

  getCurrentFriends(currentUser: IUserPayload) {
    return this.userService.getFriends(currentUser._id);
  }


  async remove(currentUser: IUserPayload , receiverId: string) {
    const receiver = await this.userService.findOne(receiverId);

    const friendRequest = await this.friendModel.findOne({
      sender: currentUser._id ,
      receiver: receiver._id ,
      status: FriendRequestType.Pending
    });
    if (!friendRequest) throw new NotFoundException('Friend request does not exist');
    await friendRequest.deleteOne();
  }
}
