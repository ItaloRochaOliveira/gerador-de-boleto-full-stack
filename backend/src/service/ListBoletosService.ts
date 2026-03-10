import { BoletoData } from "../db/typeorm/entity/BoletoData";
import BoletoRepository from "./repository/BoletoRepository";
import { ListBoletosInput } from "../controller/Boleto/schema/ListBoletosSchema";
import IServiceModel from "@/interfaces/IServiceModel";

export default class ListBoletosService implements IServiceModel<ListBoletosInput, { boletos: BoletoData[], total: number }> {
    constructor(
        private boletoRepository: BoletoRepository
    ) {}

    async execute(data: ListBoletosInput): Promise<{ status: string; message: { code: number; message: { boletos: BoletoData[], total: number } } }> {
        console.log('ListBoletosService - Buscando boletos para usuário:', data.id);
        
        // Busca apenas boletos do usuário (otimizado)
        const userBoletos = await this.boletoRepository.getByUserId(data.id!);
        
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
        
        if (data.id) {
            filteredBoletos = filteredBoletos.filter((boleto: BoletoData) => boleto.id && boleto.id.includes(data.id!));
        }
        
        if (data.min !== undefined) {
            filteredBoletos = filteredBoletos.filter((boleto: BoletoData) => boleto.valor !== null && boleto.valor >= data.min!);
        }
        
        if (data.max !== undefined) {
            filteredBoletos = filteredBoletos.filter((boleto: BoletoData) => boleto.valor !== null && boleto.valor <= data.max!);
        }
        
        // Aplica paginação
        const page = data.page || 1;
        const limit = data.limit || 10;
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
