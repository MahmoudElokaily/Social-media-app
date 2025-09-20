import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IUserPayload | null => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.currentUser ?? null;
  },
);
