import { BoletoData } from "../db/typeorm/entity/BoletoData";
import BoletoRepository from "./repository/BoletoRepository";
import { GetBoletoInput } from "../controller/Boleto/schema/GetBoletoSchema";
import BadRequest from "@/utils/errors/BadRequest";

export default class GetBoletoService {
    constructor(
        private boletoRepository: BoletoRepository
    ) {}

    async execute(data: GetBoletoInput, userId: string): Promise<BoletoData> {
        const boleto = await this.boletoRepository.getById(data.id);
        
        if (!boleto) {
            throw new BadRequest('Boleto não encontrado');
        }

        if (boleto.user_id !== userId) {
            throw new BadRequest('Acesso negado ao boleto');
        }

        return boleto;
    }
}
