const mongoose = require("mongoose");

const UserModel = mongoose.model("users", {
  nome: String, //UserName (unico)
  email: String, //Email (unico)
  senha: String,//Email (Podem existir senhas iguais)
  funcao: String //Funcao
});

module.exports = UserModel;