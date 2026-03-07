import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersRepository from './repository/UsersRepository';
import { Users } from '../db/typeorm/entity/Users';
import NotFound from '@/utils/errors/NotFound';
import { ITokeManager } from '@/interfaces/ITokenManager';
import { IHashManager } from '@/interfaces/IHashManager';
import BadRequest from '@/utils/errors/BadRequest';
import { Role } from '@/interfaces/IRequestToken';

export default class LoginUserService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly hashManager: IHashManager,
        private readonly tokenManager: ITokeManager
    ) {}

    async execute(email: string, password: string): Promise<{ token: string; user: Omit<Users, 'password'> } | null> {
        // Find user by email
        const user = await this.usersRepository.getByEmail(email);
        
        if (!user || user.deleted) {
            throw new NotFound('Usuário não encontrado');
        }

        // Check password
        const passwordMatch = await this.hashManager.compare(password, user.password || '');
        
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

        return { token, user: userWithoutPassword };
    }
}