import { Request, Response, NextFunction } from 'express';
import ListBoletosService from '../../service/ListBoletosService';
import TypeORMBoletoDataRepository from '../../service/repository/typeorm/typeormBoletoData';
import { AuthRequest } from '../../middleware/auth';
import { ListBoletosSchema } from './schema/ListBoletosSchema';

export default class ListBoletosController {

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const queryParams = ListBoletosSchema.parse(req.query);

            const boletoRepository = new TypeORMBoletoDataRepository();
            const listBoletosService = new ListBoletosService(boletoRepository);
            
            const result = await listBoletosService.execute({ query: queryParams, userId });

            res.status(200).json({
                message: result.message.message.boletos.length > 0 ? 'Boletos encontrados' : 'Nenhum boleto encontrado',
                boletos: result.message.message.boletos,    
                total: result.message.message.total,
                page: queryParams.page,
                limit: queryParams.limit
            });
        } catch (error) {
            next(error);
        }
    }
}
