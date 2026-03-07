import UsersRepository from './repository/UsersRepository';
import { Users } from '../db/typeorm/entity/Users';
import { IHashManager } from '../interfaces/IHashManager';
import NotFound from '../utils/errors/NotFound';

export default class EditUserService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly hashManager: IHashManager
    ) {}

    async execute(id: string, updates: Partial<Users>): Promise<Omit<Users, 'password'> | null> {
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

        return userWithoutPassword;
    }
}
