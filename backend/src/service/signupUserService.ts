import UsersRepository from './repository/UsersRepository';
import { Users } from '../db/typeorm/entity/Users';
import { ITokeManager } from '../interfaces/ITokenManager';
import { IHashManager } from '../interfaces/IHashManager';
import BadRequest from '../utils/errors/BadRequest';
import { Role } from '@/interfaces/IRequestToken';
import IServiceModel from '@/interfaces/IServiceModel';

export interface SignupUserInput {
    name: string;
    email: string;
    password: string;
}

export default class SignupUserService implements IServiceModel<SignupUserInput, { token: string; user: Omit<Users, 'password'> }> {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly tokenManager: ITokeManager,
        private readonly hashManager: IHashManager
    ) {}

    async execute(data: SignupUserInput): Promise<{ status: string; message: { code: number; message: { token: string; user: Omit<Users, 'password'>; }; }; }> {
        // Check if user already exists
        const existingUser = await this.usersRepository.getByEmail(data.email);
        
        if (existingUser && !existingUser.deleted) {
            throw new BadRequest('Usuário já existe');
        }

        // Hash password
        const hashedPassword = await this.hashManager.hash(data.password);

        // Create new user
        const newUser: Partial<Users> = {
            id: Math.random().toString(36).substring(2, 15),
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deleted: false
        };

        const createdUser = await this.usersRepository.create(newUser as Users);

        if (!createdUser) {
            throw new Error('Failed to create user');
        }

        // Generate JWT token
        const token = this.tokenManager.createToken({
            id: createdUser.id,
            email: createdUser.email,
            role: createdUser.role as Role
        }, process.env.JWT_SECRET || 'default_secret', '24h');

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = createdUser;

        return { 
            status: 'success', 
            message: { 
                code: 201, 
                message: { token, user: userWithoutPassword } 
            } 
        };
    }
}
