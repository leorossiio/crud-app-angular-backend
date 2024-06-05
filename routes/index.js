const server = express();

const userController = require("../Controllers/autenticacao/user");
const loginController = require("../Controllers/loginController");
const todoListController = require("../Controllers/todoListController");
const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
server.use(express.json());

const PORT = process.env.PORT;
// const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@crud-app.yso2wfp.mongodb.net/}?retryWrites=true&w=majority&appName=crup-app`;
// mongodb+srv://<username>:<password>@crud-app.yso2wfp.mongodb.net/?retryWrites=true&w=majority&appName=CRUD-APP
//DB_USER: root
//DB_PASSWORD: admin

server.use("/login", loginController);
server.use("/users", userController);
server.use("/todoList", todoListController);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Banco de dados conectado com sucesso");
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Erro ao conectar no bando de dados. ${error}`);
  });
