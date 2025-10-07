import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignIpDto } from './dto/signip.dto';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const {email , name , password , role } = signUpDto;
    const userByEmail = await this.userModel.findOne({ email });
    if (userByEmail) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, SALT);
    const user = new this.userModel({email , name , password: hashedPassword , role});
    const saveUser = await user.save();

    // Generate JWT
    const payload = {
      _id: saveUser._id,
      name,
      email,
      role: saveUser.role,
      isActive: saveUser.isActive,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { user: saveUser , accessToken };
  }

  async signIn(signIpDto: SignIpDto) {
    const {email , password} = signIpDto;
    // get user with email
    const user = await this.userModel.findOne({ email });
     if (!user || !user.isActive) {
      throw new NotFoundException('Bad Credentials');
    }
    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new NotFoundException('Bad Credentials');
    }
    // Generate JWT
    const payload = {
      _id:      user._id,
      email,
      role:     user.role,
      isActive: user.isActive };
    const accessToken = await this.jwtService.signAsync(payload);
    return { user , accessToken };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
