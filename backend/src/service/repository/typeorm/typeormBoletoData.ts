import { UpdateResult } from "typeorm";
import { BoletoData } from "../../../db/typeorm/entity/BoletoData";
import BoletoRepository from "../BoletoRepository";
import { appDataSource2 } from "@/db/typeorm/appDataSource";

export default class TypeORMBoletoDataRepository implements BoletoRepository{
    private readonly typeORM = appDataSource2.getRepository(BoletoData);

    getAll(): Promise<BoletoData[]> {
        return this.typeORM.find();
    }
    
    getById(id: string): Promise<BoletoData | null> {
        return this.typeORM.findOne({
            where: {id}
        });
    }
    
    getByUserId(userId: string): Promise<BoletoData[] | null> {
        return this.typeORM.find({
            where: { user_id: userId, deleted: false }
        });
    }
    
    create(boleto: BoletoData): Promise<BoletoData> {
        return this.typeORM.save(boleto);
    }
    edit(id: string, boleto: Partial<BoletoData>): Promise<UpdateResult> {
        return this.typeORM.update(id, boleto);
    }
    delete(id: string) {
        return this.typeORM.update(id, { deleted: true });
    }

}