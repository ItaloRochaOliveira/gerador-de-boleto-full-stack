import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT:z.coerce.number(),
    // DB_PASS: z.coerce.number(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    ENV: z.string().default('dev')
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error('❌ Invalid enviroment variable', _env.error.format());
  
    throw new Error('Invalid enviroment variables');
}

console.log(' Environment variables loaded:', {
    POSTGRES_HOST: _env.data.POSTGRES_HOST,
    POSTGRES_PORT: _env.data.POSTGRES_PORT,
    POSTGRES_USER: _env.data.POSTGRES_USER,
    POSTGRES_DB: _env.data.POSTGRES_DB,
    PORT: _env.data.PORT,
    ENV: _env.data.ENV
});
  
export const env = _env.data;