import { Request, Response, NextFunction } from 'express';
import LoginUserService from '../../service/LoginUserService';
import UsersRepository from '../../service/repository/UsersRepository';
import TypeORMUsersRepository from '../../service/repository/typeorm/typeormUsers';
import { TokenManager } from '../../utils/TokenManager';
import { HashManager } from '../../utils/HashManager';
import { LoginSchema } from './schema/LoginSchema';

export default class LoginController {

   async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = LoginSchema.parse(req.body);

            const usersRepository = new TypeORMUsersRepository();
            const tokenManager = new TokenManager();
            const hashManager = new HashManager();

            const loginService = new LoginUserService(usersRepository, hashManager, tokenManager);
            const result = await loginService.execute({ email, password });

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
