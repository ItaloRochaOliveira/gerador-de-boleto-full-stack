import { Users } from "@/db/typeorm/entity/Users";
// import { Request } from "express";

export interface IRequest {
    // user: Users,
    header: any,
    params: any,
    query: any,
    body: any,

}

export interface IHttpContext {
    getRequest(): IRequest;
    send(status: number, data: any): void;
}