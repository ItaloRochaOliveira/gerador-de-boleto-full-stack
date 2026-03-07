import { z } from 'zod';

export const EditUserSchema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
    email: z.string().email('Email inválido').optional(),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
    role: z.enum(['user', 'admin']).optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização'
});
