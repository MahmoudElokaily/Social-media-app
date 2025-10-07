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

  findAll() {
    return this.userModel.find({isActive: true});
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
}
