import { UserPayload } from '@/interfaces/IRequestToken';
import {
  DataInsert,
  ITokeManager,
} from '@/interfaces/ITokenManager';
import jwt from 'jsonwebtoken';

export class TokenManager implements ITokeManager {
  public createToken = (
    data: DataInsert,
    tokenSecret: string,
    expiresIn: string,
  ): string => {
    const token = jwt.sign(data, tokenSecret, {
      expiresIn,
    });
    return token;
  };

  public getPayload = (
    token: string,
    tokenSecret: string,
  ): UserPayload => {
    const payload = jwt.verify(token, tokenSecret);

    return payload as UserPayload;
  };
}
