import { Router } from 'express';
import LoginController from '../controller/Auth/LoginController';
import SignupController from '../controller/Auth/SignupController';
import EditUserController from '../controller/Auth/EditUserController';
import DeleteUserController from '../controller/Auth/DeleteUserController';
import { authenticateToken } from '../middleware/auth';

const router = Router();


// Public routes
router.post('/login', new LoginController().handle);
router.post('/signup', new SignupController().handle);

// Protected routes
router.put('/edit', authenticateToken, new EditUserController().handle);
router.delete('/delete', authenticateToken, new DeleteUserController().handle);

export default router;
