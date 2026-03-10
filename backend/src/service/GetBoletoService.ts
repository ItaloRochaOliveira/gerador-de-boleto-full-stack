import { BoletoData } from "../db/typeorm/entity/BoletoData";
import BoletoRepository from "./repository/BoletoRepository";
import { GetBoletoInput } from "../controller/Boleto/schema/GetBoletoSchema";
import BadRequest from "@/utils/errors/BadRequest";
import IServiceModel from "@/interfaces/IServiceModel";

export interface GetBoletoServiceInput {
    id: GetBoletoInput['id'];
    userId: string;
}

export default class GetBoletoService implements IServiceModel<GetBoletoServiceInput, BoletoData> {
    constructor(
        private boletoRepository: BoletoRepository
    ) {}

    async execute(data: GetBoletoServiceInput): Promise<{ status: string; message: { code: number; message: BoletoData; }; }> {
        const boleto = await this.boletoRepository.getById(data.id);
        
        if (!boleto) {
            throw new BadRequest('Boleto não encontrado');
        }

        if (boleto.userId !== data.userId) {
            throw new BadRequest('Acesso negado ao boleto');
        }

        return {
            status: 'success',
            message: {
                code: 200,
                message: boleto
            }
        };
    }
}
