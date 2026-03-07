import UsersRepository from './repository/UsersRepository';
import { Users } from '../db/typeorm/entity/Users';
import { ITokeManager } from '../interfaces/ITokenManager';
import { IHashManager } from '../interfaces/IHashManager';
import BadRequest from '../utils/errors/BadRequest';
import { Role } from '@/interfaces/IRequestToken';

export default class SignupUserService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly tokenManager: ITokeManager,
        private readonly hashManager: IHashManager
    ) {}

    async execute(name: string, email: string, password: string): Promise<{ token: string; user: Omit<Users, 'password'> }> {
        // Check if user already exists
        const existingUser = await this.usersRepository.getByEmail(email);
        
        if (existingUser && !existingUser.deleted) {
            throw new BadRequest('Usuário já existe');
        }

        // Hash password
        const hashedPassword = await this.hashManager.hash(password);

        // Create new user
        const newUser: Partial<Users> = {
            id: Math.random().toString(36).substring(2, 15),
            name,
            email,
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

        return { token, user: userWithoutPassword };
    }
}
