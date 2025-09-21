import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/role.decorator';
import { UserRole } from '../../user/enums/user-role.enum';
import { Request } from 'express';
import { ResourceService } from '../../resource/resource.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private resourceService: ResourceService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUser = request.currentUser;
    const resourceType = this.extractResource(request.path);
    if (!resourceType) {
      throw new BadRequestException(`Resource type not found`);
    }
    const requiedRoles = this.reflector.get(
      Roles,
      context.getHandler(),
    ) as UserRole[];
    if (!requiedRoles || requiedRoles.length === 0) {
      return true;
    }

    if (requiedRoles.includes(UserRole.ADMIN) && currentUser?.role === UserRole.ADMIN) {
      return true;
    }
    if (requiedRoles.includes(UserRole.USER) && currentUser?.role === UserRole.USER) {
      const userIds = currentUser._id;
      const resourceId = request.params.id;
      const resourceIdOfUser = await this.resourceService.getResource(resourceType , resourceId);

      if (!resourceIdOfUser) {
        throw new BadRequestException(`Resource type not found`);
      }
      if (userIds === resourceIdOfUser) return true;
      throw new ForbiddenException('You can only access your own resources');
    }
    throw new ForbiddenException("You don't have enough permissions");
  }

  private extractResource(path: string): string | null {
    const paths = path.split('/');
    if (paths.length > 3) {
      return paths[3]
    }
    return null;
  }
}
