import { UpdateResult } from "typeorm";
import { Users } from "../../db/typeorm/entity/Users";
import IRepository from "../../interfaces/IRepository";

export default interface UsersRepository extends IRepository<Users>{
    getByEmail(email: string): Promise<Users | null>;
    deletePatial(id: string): Promise<UpdateResult>;
}