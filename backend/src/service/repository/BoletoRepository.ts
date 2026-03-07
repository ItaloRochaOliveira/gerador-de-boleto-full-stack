import { UpdateResult } from "typeorm";
import { BoletoData } from "../../db/typeorm/entity/BoletoData";

export default interface BoletoRepository{
    getAll(): Promise<BoletoData[] | null>;
    getById(id: string): Promise<BoletoData | null>;
    getByUserId(userId: string): Promise<BoletoData[] | null>;
    create(boleto: BoletoData): Promise<BoletoData | null>;
    edit(id: string, boleto: Partial<BoletoData>): Promise<UpdateResult>;
    delete(id:string): Promise<UpdateResult>;
}