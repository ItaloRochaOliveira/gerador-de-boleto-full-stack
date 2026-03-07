import { createLogger, format, transports } from 'winston';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { env } from '@/env';

dotenv.config();

// Define o caminho do diretório de logs.
// Para ficar no mesmo nível que o arquivo src é necessário ser: path.join(__dirname, "../..", 'logs')
// Mas para homolog ou produção o jeito que está abaixo, após buildar, o arquivo log fica no mesmo nível que o build.
const logDirectory = path.join(process.cwd(), 'logs');

// Verifica se o diretório existe, se não, cria-o
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: new Date()
        .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        .replace(',', ''),
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
    }),
    new transports.File({ filename: path.join(logDirectory, 'combined.log') }),
  ],
});

if (env.ENV === 'dev') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
