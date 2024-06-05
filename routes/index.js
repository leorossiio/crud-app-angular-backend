const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const todoListController = require("../controllers/todoListController");

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const servidor = express();
servidor.use(express.json());
servidor.use(cors());

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@crud-app.yso2wfp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

// servidor.use("/login", loginController);
// servidor.use("/users", userController);
// servidor.use("/todoList", todoListController);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Banco de dados conectado com sucesso");
    servidor.listen(PORT, () => {
      console.log(`servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Erro ao conectar no banco de dados. ${error}`);
  });

servidor.get("/", (req, res) => {
  res.send("Metodo Get"); 
});
servidor.post("/", (req, res) => {
  res.send("Metodo post"); 
});
