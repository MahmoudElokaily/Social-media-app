import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UploadMediaDto } from '../_cores/dto/upload-media.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
  }

  async findAll(q: string , limit: number , cursor: string) {
    const query: Record<string, any> = { isActive: true };
    if (q) {
      query.$or = [
        {name: { $regex: q, $options: 'i' }},
        {email: { $regex: q, $options: 'i' }}
      ];
    }
    if (cursor) {
      query.email = { $gt: cursor };
    }

    const users = await this.userModel.find(query)
      .sort({ email : 1 })
      .limit(limit + 1)
      .lean()

    const hasNextPage = users.length > limit;
    const items = hasNextPage ? users.slice(0 , limit) : users;
    return {
      items: items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].email : null,
    };
  }

  async getCurrentUser(currentUser: IUserPayload) {
    const user = await this.userModel.findOne({ _id: currentUser._id , isActive: true });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({_id: id, isActive: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto },
      { new: true }
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async uploadAvatar(uploadMediaDto: UploadMediaDto , currentUser: IUserPayload) {
    const user = await this.findOne(currentUser._id);
    user.avatar = uploadMediaDto;
    return  user.save();
  }

  async uploadCoverPhoto(uploadMediaDto: UploadMediaDto , currentUser: IUserPayload) {
    const user = await this.findOne(currentUser._id);
    user.coverPhoto = uploadMediaDto;
    return user.save();
  }

  async addFriend(userId: string, FriendId: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { friends: FriendId },
    }
    );
  }

  async getFriends(userId: string) {
    const user = await this.userModel.findById(userId).populate('friends');
    if (!user) throw new NotFoundException('User not found');
    return user.friends;
  }

  findUsersByIds(ids: string[]) {
    return this.userModel.find({ _id: { $in: ids } });
  }
}
