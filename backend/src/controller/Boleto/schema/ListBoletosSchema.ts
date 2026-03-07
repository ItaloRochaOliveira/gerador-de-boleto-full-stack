import { z } from 'zod';

export const ListBoletosSchema = z.object({
    id: z.string().optional(),
    min: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    max: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
});

export type ListBoletosInput = z.infer<typeof ListBoletosSchema>;
