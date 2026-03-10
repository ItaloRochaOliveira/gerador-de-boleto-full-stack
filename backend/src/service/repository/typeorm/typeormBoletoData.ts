import { UpdateResult } from "typeorm";
import { BoletoData } from "../../../db/typeorm/entity/BoletoData";
import BoletoRepository from "../BoletoRepository";
import { appDataSource2 } from "@/db/typeorm/appDataSource";
import Repository from "../RepositoryModel";

export default class TypeORMBoletoDataRepository extends Repository<BoletoData> implements BoletoRepository{
    protected readonly typeORM = appDataSource2.getRepository(BoletoData);
    
    deletePatial(id: string): Promise<UpdateResult> {
        return this.typeORM.update(id, {});
    }
}