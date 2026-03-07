import { Request, Response, NextFunction } from 'express';
import CreateBoletoService from '../../service/CreateBoletoService';
import TypeORMBoletoDataRepository from '../../service/repository/typeorm/typeormBoletoData';
import { AuthRequest } from '../../middleware/auth';
import { CreateBoletoSchema } from './schema/CreateBoletoSchema';
import { ZodError } from 'zod';

export default class CreateBoletoController {

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const boletoData = CreateBoletoSchema.parse(req.body);

            const boletoRepository = new TypeORMBoletoDataRepository();
            const createBoletoService = new CreateBoletoService(boletoRepository);
            
            const result = await createBoletoService.execute(boletoData, userId);

            // Retorna os dados do boleto criado
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map(err => ({
                    campo: err.path.join('.'),
                    mensagem: `${err.path.join('.')} é obrigatório`
                }));
                
                res.status(400).json({
                    message: 'Dados inválidos',
                    errors: errorMessages
                });
                return;
            }
            next(error);
        }
    }
}
