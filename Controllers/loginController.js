const UserModel = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  const { email, senha } = req.body;

  var user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ mensagem: "Usuário não encontrado" });
  }

  //Processo responsavel por gerar o token e permitir a entrada em uma rota autenticada.
  if (await bcryptjs.compare(senha, user.senha)) {
    const token = jwt.sign(
      { nome: user.nome, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      mensagem: "Usuario logado com sucesso!",
      token: token,
    });
  } else {
    return res.status(401).json({ mensagem: "Email ou senha inválidos" });
  }
};

module.exports = loginController;