import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaType, Post } from './schemas/post.schema';
import { User } from '../user/schemas/user.schema';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeletePostDto } from './dto/delete-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
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

  async findAll() {
    const posts = await this.postModel
      .find()
      .populate('author')
    return posts;

  }

  findOne(id: string) {
    return this.postModel.findById(id).populate('author');
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
}
