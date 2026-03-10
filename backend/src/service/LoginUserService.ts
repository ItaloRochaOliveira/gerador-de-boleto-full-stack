import UsersRepository from './repository/UsersRepository';
import { Users } from '../db/typeorm/entity/Users';
import NotFound from '@/utils/errors/NotFound';
import { ITokeManager } from '@/interfaces/ITokenManager';
import { IHashManager } from '@/interfaces/IHashManager';
import BadRequest from '@/utils/errors/BadRequest';
import { Role } from '@/interfaces/IRequestToken';
import IServiceModel from '@/interfaces/IServiceModel';

export interface LoginUserInput {
    email: string;
    password: string;
}

export default class LoginUserService implements IServiceModel<LoginUserInput, { token: string}> {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly hashManager: IHashManager,
        private readonly tokenManager: ITokeManager
    ) {}

    async execute(data: LoginUserInput){
        // Find user by email
        const user = await this.usersRepository.getByEmail(data.email);
        
        if (!user || user.deleted) {
            throw new NotFound('Usuário não encontrado');
        }

        // Check password
        const passwordMatch = await this.hashManager.compare(data.password, user.password || '');
        
        if (!passwordMatch) {
            throw new BadRequest("Senha Invalida");
        }

        // Generate JWT token
        const token = this.tokenManager.createToken({
            id: user.id,
            email: user.email,
            role: user.role as Role
        }, process.env.JWT_SECRET || 'default_secret', '24h');
        
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        return { 
            status: 'success', 
            message: { 
                code: 200, 
                message: { token, user: userWithoutPassword } 
            } 
        };
    }
}