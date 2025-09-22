import {
  PipeTransform,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectId implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new UnauthorizedException(`The object id ${value} invalid`);
    }
    return value;
  }
}
