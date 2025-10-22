import { ClassConstructor, plainToInstance } from 'class-transformer';

export function transformDto<T>(dto: ClassConstructor<T> , instance: any) {
  return plainToInstance(dto , instance , { excludeExtraneousValues: true });
}

export function transformDtoArray<T>(dto: ClassConstructor<T>, instances: any[]): T[] {
  return plainToInstance(dto, instances, { excludeExtraneousValues: true });
}