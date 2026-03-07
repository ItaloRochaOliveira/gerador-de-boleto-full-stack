import UsersRepository from "./repository/UsersRepository";

export default class GetUsersService{
    constructor(
        private readonly usersRepository: UsersRepository
    ){};

    async execute(id: string){
        return this.usersRepository.getById(id);
    }
}