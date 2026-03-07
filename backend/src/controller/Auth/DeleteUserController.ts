import { Response, NextFunction } from 'express';
import DeleteUserService from '../../service/DeleteUserService';
import TypeORMUsersRepository from '../../service/repository/typeorm/typeormUsers';
import { AuthRequest } from '../../middleware/auth';

export default class DeleteUserController {

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.user!;

            const usersRepository = new TypeORMUsersRepository();
            const deleteService = new DeleteUserService(usersRepository);
            const result = await deleteService.execute(userId);

            if (!result) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
