import { Request } from 'express';

export type Role = 'normal' | 'adm';

export interface UserPayload {
  id: number;
  email: string;
  idGrupo: number;
  role: Role;
}

export interface RequestToken extends Request {
  user?: UserPayload;
}
