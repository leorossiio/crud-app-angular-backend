const mongoose = require("mongoose");

const UserModel = mongoose.model("users", {
  idUser: Number,
  nome: String, //UserName (unico)
  email: String, //Email (unico)
  senha: String, //Email (Podem existir senhas iguais)
  funcao: String //Funcao
});

module.exports = UserModel;