import { IHttpContext, IRequest } from '@/interfaces/IRequest';
import { Request, Response } from 'express';

export class ExpressAdapter implements IHttpContext {
  constructor(private request: Request, private response: Response) {}

  getRequest(): IRequest {
    // return this.request;
    return {
        header: this.request.headers,
        params: this.request.params,
        query: this.request.query,
        body: this.request.body.data,
    }
  }

  send(status: number, data: any): void {
    this.response.status(status).json(data);
  }
}