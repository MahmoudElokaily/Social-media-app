import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';
import { ReactionType } from '../_cores/globals/enum';
import { AddReactionDto } from '../post/dto/add-reaction.dto';
import { CurrentUser } from '../_cores/decorators/current-user.decorator';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {
  }
  create(createReactionDto: AddReactionDto , @CurrentUser() currentUser: IUserPayload) {
    const reaction = new this.reactionModel({
      post: createReactionDto.postId,
      type: createReactionDto.type,
      user: currentUser._id});
    return reaction.save();
  }

  findAll() {
    return `This action returns all reaction`;
  }

  findExisting(postId: string , userId: string) {
    return this.reactionModel.findOne({post: postId , user: userId});
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  async update(id: string, type: ReactionType) {
    const reaction = await this.reactionModel.findByIdAndUpdate(id , {type} , {new: true});
    if (!reaction) throw new NotFoundException('Reaction does not exist');
    return reaction;
  }

  async remove(id: string) {
    const reaction =  await this.reactionModel.findByIdAndDelete(id);
    if (!reaction) throw new NotFoundException('Reaction does not exist');
    return reaction;
  }
}
