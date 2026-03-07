import { BoletoData } from "../db/typeorm/entity/BoletoData";
import BoletoRepository from "./repository/BoletoRepository";
import { ListBoletosInput } from "../controller/Boleto/schema/ListBoletosSchema";

export default class ListBoletosService {
    constructor(
        private boletoRepository: BoletoRepository
    ) {}

    async execute(data: ListBoletosInput, userId: string): Promise<{ boletos: BoletoData[], total: number }> {
        console.log('ListBoletosService - Buscando boletos para usuário:', userId);
        
        // Busca apenas boletos do usuário (otimizado)
        const userBoletos = await this.boletoRepository.getByUserId(userId);
        
        if (!userBoletos || userBoletos.length === 0) {
            console.log('ListBoletosService - Nenhum boleto encontrado');
            return { boletos: [], total: 0 };
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
            boletos: paginatedBoletos,
            total: filteredBoletos.length
        };
    }
}
