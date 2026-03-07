import { env } from "./env";
import app from "./app";
import { appDataSource, appDataSource2 } from "./db/typeorm/appDataSource";

app.listen(
    env.PORT,
    () => {
        // appDataSource2.getInicialize().then(async () => {
        //     console.log("Database conectada com sucesso.");

        //     return appDataSource2.getIsInitialized();
        // }).catch(err => console.log(err))
        appDataSource.initialize().then(async () => {
            console.log("Database conectada com sucesso.");

            return appDataSource.isInitialized;
        }).catch(err => console.log(err))
        console.log(`🚀 HTTP Server is running! url: http://localhost:${env.PORT}`);
    }
)