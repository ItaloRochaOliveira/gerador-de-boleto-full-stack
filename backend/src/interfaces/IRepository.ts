import { DeleteResult, UpdateResult } from "typeorm";

export default interface ITypeorm<T> {
    getAll(): Promise<T[] | null>;
    getById(id: string): Promise<T | null>;
    getByUserId(userId: string): Promise<T[] | null>;
    create(boleto: T): Promise<T | null>;
    edit(id: string, boleto: Partial<T>): Promise<UpdateResult>;
    delete(id:string): Promise<DeleteResult>;
}
