const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const loginController = require("./Controllers/loginController");
const userController = require("./Controllers/autenticacao/userController");
const todoListController = require("./Controllers/autenticacao/todoListController"); 
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const servidor = express();

// Middleware para processar o corpo das solicitações como JSON
servidor.use(express.json());

// Middleware para permitir solicitações de outros domínios (CORS)
servidor.use(cors());

// Define as rotas para os controladores de login, usuário e tarefas
servidor.use("/login", loginController);
servidor.use("/users", userController);
servidor.use("/todoList", todoListController); // Rota para as tarefas

// Conexão com o banco de dados MongoDB
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@crud-app.yso2wfp.mongodb.net/${DB_NAME}`;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Banco de dados conectado com sucesso");
    servidor.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Erro ao conectar no banco de dados. ${error}`);
  });
