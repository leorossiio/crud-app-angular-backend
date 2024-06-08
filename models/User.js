const mongoose = require("mongoose");

const UserModel = mongoose.model("users", {
  nome: String,
  email: String,
  senha: String,
  funcao: String,
});

module.exports = UserModel;
