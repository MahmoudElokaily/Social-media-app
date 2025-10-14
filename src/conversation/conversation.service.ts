import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateGroupConversationDto,
} from './dto/create-group-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { UserService } from '../user/user.service';
import { AddParticipantsDto } from './dto/add-participants.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    private readonly userService: UserService,
  ) {
  }
  async createPrivate(
    createPrivateConversationDto: CreatePrivateConversationDto,
    currentUser: IUserPayload
  ) {
    const { participantsId } = createPrivateConversationDto;
    const existingConversation = await this.conversationModel.findOne({
      isGroup: false,
      participants: {$all: [currentUser._id , participantsId]}
    });

    if (existingConversation) return existingConversation;

    const user = await this.userService.findOne(participantsId);

    const conversation = new this.conversationModel({
      isGroup: false,
      participants: [currentUser._id , participantsId],
      // owner: currentUser._id
    });

    return conversation.save();
  }

  async createGroup(createGroupConversationDto: CreateGroupConversationDto , currentUser: IUserPayload) {
    const { groupName , groupAvatar , participantsIds } = createGroupConversationDto;

    const users = await this.userService.findUsersByIds(participantsIds);

    if (users.length !== participantsIds.length) {
      throw new NotFoundException('Some users not found');
    }

    const conversation = new this.conversationModel({
      isGroup: true,
      participants: [currentUser._id , ...participantsIds],
      groupName,
      groupAvatar,
      groupOwner: currentUser._id
    });

    return conversation.save();
  }

  async findAll(currentUser: IUserPayload ,  limit: number , cursor: string) {
    const query: Record<string, any> = {
      participants: {$in: [currentUser._id]},
    };

    if (cursor) {
      query.updatedAt = { $lt: new Date(cursor) };
    }

    const conversations = await this.conversationModel.find(query)
      .sort({updatedAt: -1})
      .limit(limit + 1)
      .populate('groupOwner' , 'name email')
      .populate('participants')
      .lean();

    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0 , limit) : conversations;

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].updatedAt : null,
    }
  }

  async findOne(id: string) {
    const conversation = await this.conversationModel.findById(id)
      .populate('participants')
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async update(id: string, updateConversationDto: UpdateConversationDto , currentUser: IUserPayload) {
    const {groupName, groupAvatar} = updateConversationDto;
    const conversation = await this.conversationModel.findById(id);
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (currentUser._id !== conversation.groupOwner?._id.toString())  throw new ForbiddenException();
    conversation.groupAvatar = groupAvatar || conversation.groupAvatar;
    conversation.groupName = groupName || conversation.groupName;
    return  conversation.save();
  }

  async addParticipants(id: string,currentUser: IUserPayload , addParticipantsDto: AddParticipantsDto) {
    const { participantIds } = addParticipantsDto;
    const conversation = await this.findOne(id);
    if (!conversation.isGroup) throw new BadRequestException('add participants should be in group conversation only');

    if (conversation.groupOwner?._id.toString() !== currentUser._id) throw new ForbiddenException();

    const participants = await this.userService.findUsersByIds(participantIds);
    if (participants.length !== participantIds.length) {
      throw new NotFoundException('Some users not found');
    }
    const existingIds = conversation.participants.map(p => p._id.toString());
    const newParticipants = participants.filter(
      user => !existingIds.includes(user._id.toString())
    );
    if (newParticipants.length === 0) {
      throw new BadRequestException('All participants already exist in conversation');
    }
    conversation.participants.push(...newParticipants);
    await conversation.save();
  }

  async removeParticipants(id: string,currentUser: IUserPayload , removeParticipantsDto: AddParticipantsDto) {
    const { participantIds } = removeParticipantsDto;
    const conversation = await this.findOne(id);
    if (!conversation.isGroup) throw new BadRequestException('add participants should be in group conversation only');

    if (conversation.groupOwner?._id.toString() !== currentUser._id) throw new ForbiddenException();

    if (participantIds.includes(conversation.groupOwner?._id.toString())) throw new BadRequestException("Can't remove owner");

    const filteredParticipants = conversation.participants.filter(p => !participantIds.includes(p._id.toString()));

    conversation.participants = filteredParticipants;
    await conversation.save();
  }

  async remove(id: string , currentUser: IUserPayload) {
    const conversation = await this.findOne(id);
    if (conversation.isGroup && conversation.groupOwner?._id.toString() !== currentUser._id) throw new ForbiddenException();
    await conversation.deleteOne();
    // TODO Delete all message in this conversation
  }
}
