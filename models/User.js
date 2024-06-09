const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const UserModel = mongoose.model("users", {
  idUser: String,
  nome: String, //UserName (unico)
  email: String, //Email (unico)
  senha: String, //Email (Podem existir senhas iguais)
  funcao: String //Funcao
});

module.exports = UserModel;