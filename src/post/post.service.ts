import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from '../reaction/reaction.service';
import { ReactionType } from '../_cores/globals/enum';
import { RemoveReactionDto } from './dto/remove-reaction.dto';
import { log } from 'node:util';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly reactionService: ReactionService,
  ) {
  }
  create(createPostDto: CreatePostDto , currentUser: IUserPayload) {
    const newPost =  new this.postModel({...createPostDto , author: currentUser});
    return newPost.save();
  }

  async uploadMeda(id: string, uploadMediaDto: UploadMediaDto[]) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    uploadMediaDto.forEach((mediaDto) => {
        post.mediaFiles.push(mediaDto);
    })
    return post.save();
  }

  async deleteMedia(id: string, deletePostDto: DeletePostDto) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    post.mediaFiles = post.mediaFiles.filter((mediaFile) => mediaFile.public_id !== deletePostDto.mediaId);
    return post.save();
  }

  async findAll(currentUser: IUserPayload , limit: number, cursor: string) {
    const query: Record<string, object> = {};
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }
    const posts = await this.postModel
      .find(query)
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean()
    const hasNextPage = posts.length > limit;
    const items = hasNextPage ? posts.slice(0 , limit) : posts;
    const itemsWithReactions = await Promise.all(items.map(async (item) => {
        const myReaction = await this.reactionService.findExisting(item._id.toString() , currentUser._id.toString()).lean();
        return {...item , myReaction: myReaction?.type};
    }) );
    return {
      items: itemsWithReactions,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null,
    };
  }

  private async findOne(id: string) {
    const post = await this.postModel.findById(id).populate('author');
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findOneWithMyReaction(id: string,currentUser: IUserPayload) {
    const post = await this.postModel.findById(id).populate('author').lean();
    if (!post) throw new NotFoundException('Post not found');
    const myReaction = await this.reactionService.findExisting(post._id.toString() , currentUser._id.toString());
    return {...post , myReaction: myReaction?.type};
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findByIdAndUpdate(id, updatePostDto , { new: true });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async addReaction(addReactionDto: AddReactionDto, currentUser: IUserPayload) {
    const { postId, type } = addReactionDto;
    const post = await this.findOne(postId);
    const existingReaction = await this.reactionService.findExisting(postId, currentUser._id);

    let oldReactionsType: ReactionType | null = null;

    if (existingReaction) {
      // لو نفس التفاعل مفيش داعي نعمل حاجة
      if (type === existingReaction.type) {
        return post;
      }

      oldReactionsType = existingReaction.type;
      await this.reactionService.update(existingReaction._id.toString(), type);
    } else {
      await this.reactionService.create(addReactionDto, currentUser);
    }

    // نتأكد إن reactionCounts موجودة
    if (!post.reactionCounts) {
      post.reactionCounts = new Map<ReactionType, number>();
    }

    // لو فيه تفاعل قديم: نقص واحد
    if (oldReactionsType !== null) {
      const oldValue = post.reactionCounts.get(oldReactionsType) || 0;
      post.reactionCounts.set(oldReactionsType, Math.max(oldValue - 1, 0));
    }

    // نزود واحد على التفاعل الجديد
    const newValue = post.reactionCounts.get(type) || 0;
    post.reactionCounts.set(type, newValue + 1);

    return post.save();
  }

  async removeReaction(removeReactionDto: RemoveReactionDto , currentUser: IUserPayload) {
    const { postId } = removeReactionDto;
    const post = await this.findOne(postId);
    const existingReaction = await this.reactionService.findExisting(postId, currentUser._id);
    if (!existingReaction) return;
    await this.reactionService.remove(existingReaction._id.toString());
    return this.postModel.findByIdAndUpdate(post._id , { $inc: { [`reactionCounts.${existingReaction.type}`]: -1 }, } , { new: true });
  }

}
