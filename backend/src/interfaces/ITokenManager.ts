import { Role, UserPayload } from './IRequestToken';

export interface DataInsert {
  id: string;
  email: string;
  role: Role;
}

export interface ITokeManager {
  createToken(
    data: DataInsert,
    tokenSecret: string,
    expiresIn: string,
  ): string;
  getPayload(token: string, tokenSecret: string): UserPayload;
}
