import UsersRepository from './repository/UsersRepository';
import { Users } from '../db/typeorm/entity/Users';
import NotFound from '../utils/errors/NotFound';
import IServiceModel from '@/interfaces/IServiceModel';

export type DeleteUserInput = string;

export default class DeleteUserService implements IServiceModel<DeleteUserInput, Omit<Users, 'password'>> {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}

    async execute(id: DeleteUserInput): Promise<{ status: string, message: { code: number, message: Omit<Users, 'password'> } }> {
        // Soft delete user
        const userExist = await this.usersRepository.getById(id);
        if (!userExist) {
            throw new NotFound('Usuário não encontrado ou já deletado');
        }

        const result = await this.usersRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFound('Usuário não encontrado ou já deletado');
        }

        const { password: _, ...userWithoutPassword } = userExist;

        return {
            status: 'success',
            message: {
                code: 200,
                message: userWithoutPassword
            }
        };
    }
}
