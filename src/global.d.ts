export {};

declare global {
  interface IUserPayload {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }

  namespace Express {
    interface Request {
      currentUser?: IUserPayload;
    }
  }
}

// export class MediaType {
//   public_id: string;
//   version: string;
//   display_name: string;
//   format: string;
//   resource_type: string;
// }
