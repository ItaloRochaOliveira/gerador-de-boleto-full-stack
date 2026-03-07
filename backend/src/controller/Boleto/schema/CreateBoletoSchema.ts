import { z } from 'zod';

export const CreateBoletoSchema = z.object({
    nomeEmpresa: z.string().min(1, 'Nome da empresa é obrigatório').max(100),
    cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido').max(18),
    endereco: z.string().min(1, 'Endereço é obrigatório').max(255),
    descricaoReferencia: z.string().min(1, 'Descrição é obrigatória').max(255),
    valor: z.number().positive('Valor deve ser positivo'),
    vencimento: z.string().transform((val) => {
        // Converte formato DD/MM/YYYY para YYYY-MM-DD
        const parts = val.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
        }
        return new Date(val);
    }).refine((date) => !isNaN(date.getTime()), 'Data de vencimento inválida')
});

export type CreateBoletoInput = z.infer<typeof CreateBoletoSchema>;
