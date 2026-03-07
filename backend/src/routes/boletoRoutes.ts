import { Router } from 'express';
import CreateBoletoController from '../controller/Boleto/CreateBoletoController';
import GetBoletoController from '../controller/Boleto/GetBoletoController';
import ListBoletosController from '../controller/Boleto/ListBoletosController';
import GeneratePdfController from '../controller/Boleto/GeneratePdfController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes - todas as rotas de boleto exigem autenticação
router.post('/create', authenticateToken, new CreateBoletoController().handle);
router.get('/:id', authenticateToken, new GetBoletoController().handle);
router.get('/', authenticateToken, new ListBoletosController().handle);
router.get('/:id/pdf', authenticateToken, new GeneratePdfController().handle);
router.get('/pdf/all', authenticateToken, new GeneratePdfController().handleAll);

export default router;
