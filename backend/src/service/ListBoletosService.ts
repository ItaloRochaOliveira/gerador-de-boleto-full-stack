import { BoletoData } from "../db/typeorm/entity/BoletoData";
import BoletoRepository from "./repository/BoletoRepository";
import { ListBoletosInput } from "../controller/Boleto/schema/ListBoletosSchema";
import IServiceModel from "@/interfaces/IServiceModel";

export interface ListBoletosServiceInput {
    query: ListBoletosInput;
    userId: string;
}

export default class ListBoletosService implements IServiceModel<ListBoletosServiceInput, { boletos: BoletoData[], total: number }> {
    constructor(
        private boletoRepository: BoletoRepository
    ) {}

    async execute(data: ListBoletosServiceInput): Promise<{ status: string; message: { code: number; message: { boletos: BoletoData[], total: number } } }> {
        console.log('ListBoletosService - Buscando boletos para usuário:', data.userId);
        
        // Busca apenas boletos do usuário (otimizado)
        const userBoletos = await this.boletoRepository.getByUserId(data.userId);
        
        if (!userBoletos || userBoletos.length === 0) {
            console.log('ListBoletosService - Nenhum boleto encontrado');
            return {
                status: 'success',
                message: {
                    code: 200,
                    message: {
                        boletos: [],
                        total: 0
                    }
                }
            };
        }

        console.log('ListBoletosService - Boletos encontrados:', userBoletos.length);

        // Aplica filtros adicionais se fornecidos
        let filteredBoletos = userBoletos;
        
        if (data.query.id) {
            filteredBoletos = filteredBoletos.filter((boleto: BoletoData) => boleto.id && boleto.id.includes(data.query.id!));
        }
        
        if (data.query.min !== undefined) {
            filteredBoletos = filteredBoletos.filter((boleto: BoletoData) => boleto.valor !== null && boleto.valor >= data.query.min!);
        }
        
        if (data.query.max !== undefined) {
            filteredBoletos = filteredBoletos.filter((boleto: BoletoData) => boleto.valor !== null && boleto.valor <= data.query.max!);
        }
        
        // Aplica paginação
        const page = data.query.page || 1;
        const limit = data.query.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedBoletos = filteredBoletos.slice(startIndex, endIndex);

        console.log('ListBoletosService - Retornando:', paginatedBoletos.length, 'de', filteredBoletos.length);

        return {
            status: 'success',
            message: {
                code: 200,
                message: {
                    boletos: paginatedBoletos,
                    total: filteredBoletos.length
                }
            }
        };
    }
}

