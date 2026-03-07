import { UpdateResult } from "typeorm";
import { Users } from "../../db/typeorm/entity/Users";

export default interface UsersRepository{
    getAll(): Promise<Users[] | null>;
    getById(id: string): Promise<Users | null>;
    getByEmail(email: string): Promise<Users | null>;
    create(user: Users): Promise<Users | null>;
    edit(id: string, user: Users): Promise<UpdateResult>;
    delete(id:string): Promise<UpdateResult>;
}