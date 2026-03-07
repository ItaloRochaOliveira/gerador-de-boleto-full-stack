import { env } from "@/env";
import { TypeormAdapter } from "@/interfaceAdapters/TypeormAdapter";
import { DataSource } from "typeorm";
import { Users } from "./entity/Users";
import { BoletoData } from "./entity/BoletoData";

// const pathOfEntities = path.join(__dirname, "entity", "*.ts");

const appDataSource = new DataSource({
    type: "postgres",
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    synchronize: false,
    logging: true,
    entities: [
        Users,
        BoletoData
    ],
    subscribers: [],
    migrations: [],
});

const appDataSource2 = new TypeormAdapter(appDataSource).getTypeorm();

export {appDataSource, appDataSource2};