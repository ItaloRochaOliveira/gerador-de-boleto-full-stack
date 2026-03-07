import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";

type LogType<T> = T extends Array<infer U> ? U : T;


export interface ITypeorm<T extends ObjectLiteral> {
    getRepository(entitie: EntityTarget<T>): Repository<T>;
    getInicialize(): Promise<DataSource>;
    getIsInitialized(): boolean;
}

export interface ITypeormcontext<T extends ObjectLiteral> {
    getTypeorm(): ITypeorm<T>;
}