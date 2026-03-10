import { BoletoData } from "../../db/typeorm/entity/BoletoData";
import IRepository from "../../interfaces/IRepository";
import { UpdateResult } from "typeorm";

export default interface BoletoRepository extends IRepository<BoletoData> {
    deletePatial(id: string): Promise<UpdateResult>;
}