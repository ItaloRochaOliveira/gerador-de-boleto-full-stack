import { Request, Response, NextFunction } from 'express';
import SignupUserService from '../../service/signupUserService';
import TypeORMUsersRepository from '../../service/repository/typeorm/typeormUsers';
import { TokenManager } from '../../utils/TokenManager';
import { HashManager } from '../../utils/HashManager';
import { SignupSchema } from './schema/SignupSchema';

export default class SignupController {

   async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password } = SignupSchema.parse(req.body);

            const usersRepository = new TypeORMUsersRepository();
            const tokenManager = new TokenManager();
            const hashManager = new HashManager();

            const signupService = new SignupUserService(usersRepository, tokenManager, hashManager);
            const result = await signupService.execute(name, email, password);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}
