
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export function TransformDto(dto) {
  return UseInterceptors(new TransformDtoInterceptor(dto))
}
@Injectable()
export class TransformDtoInterceptor implements NestInterceptor {
  constructor(private readonly dtoclass) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const isAuthenticationUrl = request.path.includes('auth');
    return next
      .handle()
      .pipe(
        map((data) => {
          if (data === null || data === undefined) {
            return { message: 'Success' };
          }
          if (data && Object.prototype.hasOwnProperty.call(data , 'hasNextPage')) {
            const {items , hasNextPage , cursor} = data;
            return {
              message: "Success",
              items: plainToInstance(this.dtoclass , items , {excludeExtraneousValues: true}),
              hasNextPage,
              cursor,
            }
          }

          const {user , accessToken } = data;
          if (isAuthenticationUrl) {
            return {
              message: "Success",
              user: plainToInstance(this.dtoclass , user , {excludeExtraneousValues: true}),
              accessToken: accessToken,
            }
          }
          return {
            message: "Success",
            data: plainToInstance(this.dtoclass , data , {excludeExtraneousValues: true}),
          }
        }),
      );
  }
}
