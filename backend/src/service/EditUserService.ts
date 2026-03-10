import UsersRepository from './repository/UsersRepository';
import { Users } from '../db/typeorm/entity/Users';
import { IHashManager } from '../interfaces/IHashManager';
import NotFound from '../utils/errors/NotFound';
import IServiceModel from '@/interfaces/IServiceModel';

export interface EditUserInput {
    id: string;
    updates: Partial<Users>;
}

export type OmitPassword = Omit<Users, 'password'>;

export default class EditUserService implements IServiceModel<EditUserInput, OmitPassword> {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly hashManager: IHashManager
    ) {}

    async execute(data: EditUserInput) {
        const { id, updates } = data;
        if (updates.password) {
            updates.password = await this.hashManager.hash(updates.password);
        }

        updates.updatedAt = new Date().toISOString();
        const result = await this.usersRepository.edit(id, updates as Users);

        if (result.affected === 0) {
            throw new NotFound('Usuário não encontrado');
        }

        const updatedUser = await this.usersRepository.getById(id);
        
        if (!updatedUser) {
            throw new NotFound('Usuário não encontrado');
        }

        const { password: _, ...userWithoutPassword } = updatedUser;

        return {
            status: 'success',
            message: {
                code: 200,
                message: userWithoutPassword
            }
        };
    }
}
