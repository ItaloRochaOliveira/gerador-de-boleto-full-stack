import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import BadRequest from '@/utils/errors/BadRequest';
import TypeORMUsersRepository from '@/service/repository/typeorm/typeormUsers';

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        throw new BadRequest('  Access token required');
    }

    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', async (err, decoded) => {
        if (err) {
            throw new BadRequest('Invalid or expired token');
        }

        const userDecoded = decoded as { id: string; email: string; role: string };
        
        // Verificar se o usuário existe no banco de dados
        const usersRepository = new TypeORMUsersRepository();
        const user = await usersRepository.getById(userDecoded.id);
        
        if (!user || user.deleted) {
            throw new BadRequest('User not found');
        }

        req.user = userDecoded;
        next();
    });
};

export { AuthRequest };
