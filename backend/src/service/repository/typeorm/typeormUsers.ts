import { UpdateResult } from "typeorm";
import { Users } from "../../../db/typeorm/entity/Users";
import UsersRepository from "../UsersRepository";
import { appDataSource2 } from "@/db/typeorm/appDataSource";
import Repository from "../RepositoryModel";

export default class TypeORMUsersRepository extends Repository<Users> implements UsersRepository{
    protected readonly typeORM = appDataSource2.getRepository(Users);

    getByEmail(email: string): Promise<Users | null> {
        return this.typeORM.findOne({
            where: {email}
        });
    }

    deletePatial(id: string): Promise<UpdateResult> {
        return this.typeORM.update(id, {});
    }
}
