export {};

declare global {
  interface IUserPayload {
    _id: string;
    name: string;
    email: string;
    role: string;
  }

  namespace Express {
    interface Request {
      currentUser?: IUserPayload;
    }
  }
}
