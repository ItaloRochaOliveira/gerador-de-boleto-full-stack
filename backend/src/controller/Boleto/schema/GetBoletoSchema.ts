import { z } from 'zod';

export const GetBoletoSchema = z.object({
    id: z.string().min(1, 'ID de boleto é obrigatório')
});

export type GetBoletoInput = z.infer<typeof GetBoletoSchema>;
