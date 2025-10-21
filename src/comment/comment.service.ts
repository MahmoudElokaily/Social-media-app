import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PostService } from '../post/post.service';
import { Comment } from './schemas/comment.schema';
import { UserService } from '../user/user.service';
import { CommentGateway } from './comment.gateway';
import { transformDto } from '../_cores/utills/transorm-dto.utils';
import { ResponseCommentDto } from './dto/response-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly postService: PostService,
    private readonly userService: UserService,
    private readonly commentGateway: CommentGateway,
  ) {
  }

  async create(createCommentDto: CreateCommentDto , currentUser: IUserPayload) {
    const {postId , content , parentCommentId , replyToUser} = createCommentDto;
    const post = await this.postService.findOne(postId);
    let realParentCommentId: Types.ObjectId | null  = null;
    let realReplyToUserId: Types.ObjectId | null  = null;

    if (replyToUser){
      const userReply = await this.userService.findOne(replyToUser);
      realReplyToUserId = userReply._id;
    }
    if (parentCommentId) {
      const parentComment = await this.commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundException('Parent comment not found');
      realParentCommentId = parentComment.parent?._id ? parentComment.parent._id : parentComment.id;
    }


    const comment = new this.commentModel({
      content,
      post,
      parent: realParentCommentId,
      userComment: currentUser._id,
      replyToUser: realReplyToUserId
    });
    const savedComment = await comment.save();
    const populatedComment = await this.findOne(savedComment._id.toString());
    const responseCommentDto = transformDto(ResponseCommentDto , populatedComment);
    this.commentGateway.handleCommentCreate(postId , responseCommentDto);
    return savedComment;
  }

  async getComments(postId: string) {
    // const post = await this.postService.findOne(postId);
    const comments = await this.commentModel.find({ post: postId })
      .populate([
        { path: 'userComment' },
        { path: 'replyToUser' }
      ])
      .lean();
    const finalResult: any[] = [];
    for (const comment of comments) {
      if (!comment.parent) {
        finalResult.push({...comment, replies: []});
      }
      else {
        const foundRootComment = finalResult.find(c => c._id.toString() === comment.parent?._id.toString());
        if (foundRootComment) {
          foundRootComment.replies.push(comment);
        }
      }

    }
    return finalResult;
  }


  async findOne(id: string) {
    const comment = await this.commentModel.findById(id) .populate([
      { path: 'userComment' },
      { path: 'replyToUser' }
    ]);
    if (!comment) throw new NotFoundException('Comment not found');

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentModel.findByIdAndUpdate(id, {content : updateCommentDto.content} , { new: true });
    if (!comment) throw new NotFoundException('Comment not found');
    this.commentGateway.handleCommentUpdate(id , comment.content , comment.updatedAt);
    return comment;
  }

  async remove(id: string) {
    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (!comment.parent){
      await this.commentModel.deleteMany({parent:comment._id});
    }
    this.commentGateway.handleCommentRemove(id , comment.parent ? comment.parent._id.toString() : null);
  }
}
