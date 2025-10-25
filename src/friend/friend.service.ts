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
import { FriendGateway } from './friend.gateway';
import { transformDto } from '../_cores/utills/transorm-dto.utils';
import { ResponseFriendRequestDto } from './dto/response-friend-request.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(FriendRequest.name) private friendModel: Model<FriendRequest>,
    private userService: UserService,
    private friendGateway: FriendGateway
  )
  {}
  async create(currentUser: IUserPayload , receiverId: string) {
    // receiver user exist
    const receiver = await this.userService.findOne(receiverId);
    // prevent send request to yourself
    if (currentUser._id === receiver._id.toString()) throw new BadRequestException('Cannot send a friend request to yourself');

    // prevent duplicate the same friend request
    const existingFriendRequest = await this.friendModel.findOne({
      $or: [
        {
          sender: currentUser._id,
          receiver: receiver._id,
          status: {$in: [FriendRequestType.Pending , FriendRequestType.Accept]}
        },
        {
          sender: receiver._id,
          receiver: currentUser._id,
          status: {$in: [FriendRequestType.Pending , FriendRequestType.Accept]}
        },
      ]
    });

    if (existingFriendRequest) throw new BadRequestException('The friend request already sent');

    const friendRequest =  new this.friendModel({
      sender: currentUser._id ,
      receiver: receiver._id ,
      status: FriendRequestType.Pending
    });

    const savedFriend = await friendRequest.save();
    const populatedFriendRequest = await this.findOne(savedFriend._id.toString());
    const responseFriendRequestDro = transformDto(ResponseFriendRequestDto , populatedFriendRequest);
    this.friendGateway.handleSendFriendRequest(receiverId , responseFriendRequestDro);
  }

  async unFriend(currentUser: IUserPayload , friendId: string) {
    const friend = await this.userService.findOne(friendId);
    if (!friend) throw new NotFoundException('User not found');
    if (currentUser._id.toString() === friend._id.toString()) throw new BadRequestException("You can't unfriend yourself");
    const isFriend = await this.userService.checkIsFriend(currentUser._id , friend._id.toString());
    if (!isFriend) throw new BadRequestException("You are not friends");
    // remove friend from each others
    await this.userService.removeFriend(currentUser._id , friend._id.toString());
    await this.userService.removeFriend(friend._id.toString() , currentUser._id);
    //Remove friendRequest
    await this.friendModel.deleteOne({
      $or: [
        { sender: currentUser._id, receiver: friend._id , status: FriendRequestType.Accept },
        { sender: friend._id, receiver: currentUser._id , status: FriendRequestType.Accept },
      ],
    });

    this.friendGateway.handleUnfriend(friend._id.toString() , currentUser._id.toString());
  }

  async acceptFriendRequest(currentUser: IUserPayload,friendRequestId: string) {
    const friendRequest = await this.friendModel.findById(friendRequestId).populate('sender' , 'name avatar');
    if (!friendRequest) throw new NotFoundException('Friend request does not exist');
    if (friendRequest.status !== FriendRequestType.Pending) throw new BadRequestException('Friend request already handled');
    if (currentUser._id !== friendRequest.receiver._id.toString()) throw new ForbiddenException();

    friendRequest.status = FriendRequestType.Accept;
    await friendRequest.save();

    await this.userService.addFriend(friendRequest.sender._id.toString() , friendRequest.receiver._id.toString());
    await this.userService.addFriend(friendRequest.receiver._id.toString() , friendRequest.sender._id.toString());
    const responseFriendRequestDto = transformDto(ResponseFriendRequestDto , friendRequest);
    // this.friendGateway.handleAcceptRequest({
    //   friendRequestId ,
    //   _id: friendRequest.sender._id.toString(),
    //   name: friendRequest.sender.name,
    //   avatarUrl: friendRequest.sender?.avatar?.url ? friendRequest.sender.avatar?.url : null,
    // })
    this.friendGateway.handleAcceptRequest(
      friendRequest.sender._id.toString(),
      responseFriendRequestDto,
      currentUser._id
    );
  }
  async rejectFriendRequest(currentUser: IUserPayload,friendRequestId: string) {
    const friendRequest = await this.friendModel.findById(friendRequestId);
    if (!friendRequest) throw new NotFoundException('Friend request does not exist');
    if (friendRequest.status !== FriendRequestType.Pending) throw new BadRequestException('Friend request already handled');
    if (currentUser._id !== friendRequest.receiver._id.toString()) throw new ForbiddenException();

    friendRequest.status = FriendRequestType.Reject;

    await friendRequest.save();
    this.friendGateway.handleRejectRequest(friendRequest.sender._id.toString() , friendRequestId , currentUser._id);

  }

  async findOne(id: string) {
    const friend = await this.friendModel.findById(id).populate([
      { path: 'sender' , select: 'name email avatar' },
      { path: 'receiver' , select: 'name email avatar'},
    ]);
    if (!friend) throw new NotFoundException('Friend request does not exist');
    return friend;
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
    this.friendGateway.handleCancelRequest(receiverId , friendRequest.sender._id.toString() , friendRequest?._id.toString());
  }
}
