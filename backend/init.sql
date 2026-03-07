CREATE TABLE IF NOT EXISTS users(
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100),
    role VARCHAR(15) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS boleto_data(
    id VARCHAR(36) PRIMARY KEY,
    nome_empresa VARCHAR(100),
    cpf_cnpj VARCHAR(18),
    endereco VARCHAR(255),
    descricao_referencia VARCHAR(255),
    valor NUMERIC(10,2),
    vencimento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (id, name, email, password, role)
VALUES
('92056f79-327d-4792-9543-ccf68f8597a8','User Admin','user.admin@gmail.com','$2a$14$jVZnYnz2GY9xdJ7ZLmi/Qum.EMA.C/LumRdiwWxlJWAUmCF.P7WZy','admin'), -- senha: Senha@123
('92056f79-327d-4792-9543-ccf68f8597a9','User Test','user.test@gmail.com','$2a$14$jVZnYnz2GY9xdJ7ZLmi/Qum.EMA.C/LumRdiwWxlJWAUmCF.P7WZy','user'), -- senha: Senha@123
('92056f79-327d-4792-9543-ccf68f8597aa','User Test 2','user.test2@gmail.com','$2a$14$jVZnYnz2GY9xdJ7ZLmi/Qum.EMA.C/LumRdiwWxlJWAUmCF.P7WZy','user'); -- senha: Senha@123

INSERT INTO boleto_data (id, nome_empresa, cpf_cnpj, endereco, descricao_referencia, valor, vencimento, user_id)
VALUES
('43cbe748-32f5-48fe-86d1-a8a591f28b35','Empresa Teste','12345678901234','Rua Teste, 123','Referência Teste',100.00,'2024-05-31','92056f79-327d-4792-9543-ccf68f8597a9'),
('43cbe748-32f5-48fe-86d1-a8a591f28b36','Empresa Teste 2','12345678901235','Rua Teste 2, 123','Referência Teste 2',200.00,'2024-05-31','92056f79-327d-4792-9543-ccf68f8597aa');