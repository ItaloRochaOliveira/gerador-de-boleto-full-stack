import { Request, Response, NextFunction } from 'express';
import GetBoletoService from '../../service/GetBoletoService';
import TypeORMBoletoDataRepository from '../../service/repository/typeorm/typeormBoletoData';
import { AuthRequest } from '../../middleware/auth';
import { GetBoletoSchema } from './schema/GetBoletoSchema';

export default class GetBoletoController {

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = GetBoletoSchema.parse(req.params);

            const boletoRepository = new TypeORMBoletoDataRepository();
            const getBoletoService = new GetBoletoService(boletoRepository);
            
            const boleto = await getBoletoService.execute({ id }, userId);

            // Retorna os dados do boleto
            res.status(200).json(boleto);
        } catch (error) {
            next(error);
        }
    }
}
