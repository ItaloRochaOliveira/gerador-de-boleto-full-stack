import { BoletoData } from "../db/typeorm/entity/BoletoData";
import BoletoRepository from "./repository/BoletoRepository";
import { CreateBoletoInput } from "../controller/Boleto/schema/CreateBoletoSchema";
import TypeORMBoletoDataRepository from "./repository/typeorm/typeormBoletoData";
import BadRequest from "@/utils/errors/BadRequest";

export default class CreateBoletoService {
    constructor(
        private boletoRepository: BoletoRepository
    ) {}

    async execute(data: CreateBoletoInput, userId: string): Promise<BoletoData> {
        const id = Math.random().toString(36).substring(2, 15);
        const createdAt = new Date().toISOString();

        const newBoleto = new BoletoData(
            id,
            data.nomeEmpresa,
            data.cpfCnpj,
            data.endereco,
            data.descricaoReferencia,
            data.valor,
            data.vencimento,
            createdAt,
            createdAt,
            false,
            null,
            userId
        );

        const result = await this.boletoRepository.create(newBoleto);
        
        if (!result) {
            throw new BadRequest('Erro ao criar boleto');
        }

        return result;
    }
}
