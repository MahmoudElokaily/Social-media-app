import { Transform } from 'class-transformer';

export const objectId =   () => {
  return Transform((value) => value.obj._id.toString());
}
