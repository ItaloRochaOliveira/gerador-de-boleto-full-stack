import { Request, Response, NextFunction } from 'express';
import GetBoletoService from '../../service/GetBoletoService';
import ListBoletosService from '../../service/ListBoletosService';
import TypeORMBoletoDataRepository from '../../service/repository/typeorm/typeormBoletoData';
import { AuthRequest } from '../../middleware/auth';
import { GetBoletoSchema } from './schema/GetBoletoSchema';
import { ListBoletosSchema } from './schema/ListBoletosSchema';
import { PdfGenerator } from '../../utils/PdfGenerator';

export default class GeneratePdfController {

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { id } = GetBoletoSchema.parse(req.params);

            const boletoRepository = new TypeORMBoletoDataRepository();
            const getBoletoService = new GetBoletoService(boletoRepository);
            
            const boleto = await getBoletoService.execute({ id, userId });

            // Converte para o formato esperado pelo PDF
            const pdfData = PdfGenerator.convertToPdfFormat(boleto);
            
            // Gera e retorna o PDF
            await PdfGenerator.generateBoletoPdf(pdfData, res);
        } catch (error) {
            next(error);
        }
    }

    async handleAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const queryParams = ListBoletosSchema.parse(req.query);

            const boletoRepository = new TypeORMBoletoDataRepository();
            const listBoletosService = new ListBoletosService(boletoRepository);
            
            const result = await listBoletosService.execute({ query: queryParams, userId });

            if (result.message.message.boletos.length === 0) {
                res.status(404).json({ message: 'Nenhum boleto encontrado' });
                return; 
            }

            // Gera PDF com múltiplos boletos
            await PdfGenerator.generateMultipleBoletosPdf(result.message.message.boletos, res);
        } catch (error) {
            next(error);
        }
    }
}
