import { Response, NextFunction } from 'express';
import EditUserService from '../../service/EditUserService';
import TypeORMUsersRepository from '../../service/repository/typeorm/typeormUsers';
import { AuthRequest } from '../../middleware/auth';
import { HashManager } from '../../utils/HashManager';
import { EditUserSchema } from './schema/EditUserSchema';

export default class EditUserController {

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const updates = EditUserSchema.parse(req.body);

            const usersRepository = new TypeORMUsersRepository();
            const hashManager = new HashManager();
            const editService = new EditUserService(usersRepository, hashManager);
            const result = await editService.execute({ id: userId, updates });

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
