import { BoletoData } from "../db/typeorm/entity/BoletoData";
import BoletoRepository from "./repository/BoletoRepository";
import { GetBoletoInput } from "../controller/Boleto/schema/GetBoletoSchema";
import BadRequest from "@/utils/errors/BadRequest";
import IServiceModel from "@/interfaces/IServiceModel";

export default class GetBoletoService implements IServiceModel<GetBoletoInput, BoletoData> {
    constructor(
        private boletoRepository: BoletoRepository
    ) {}

    async execute(data: GetBoletoInput): Promise<{ status: string; message: { code: number; message: BoletoData; }; }> {
        const boleto = await this.boletoRepository.getById(data.id);
        
        if (!boleto) {
            throw new BadRequest('Boleto não encontrado');
        }

        if (boleto.user_id !== data.id) {
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
