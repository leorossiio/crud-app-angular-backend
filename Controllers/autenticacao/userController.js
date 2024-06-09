const bcryptjs = require("bcryptjs");
const auth = require("../../middlewares/authentication"); // middleware para rotas autenticadas
const UserModel = require("../../models/User");
const express = require("express");
const userController = express.Router();


function generateId() {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Conversor
const funcoes = {
  1: "Engenheiro de FE",
  2: "Engenheiro de BE",
  3: "Analista de dados",
  4: "Líder Técnico",
};

// Rotas não autenticadas:

// Rota para criar um novo usuario/cliente
userController.post("/cadastroUsuarioNaoAutenticada", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    let idUser = generateId();
    let userExistente = await UserModel.findOne({ idUser: idUser });

    // Verificar se o idUser já existe e tentar novamente até encontrar um único
    while (userExistente) {
      idUser = generateId();
      userExistente = await UserModel.findOne({ idUser: idUser });
    }

    const usuarioExistente = await UserModel.findOne({
      $or: [{ nome: nome }, { email: email }],
    });
    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Nome de usuário ou email já existe!",
      });
    }

    const senhaEncrypt = await bcryptjs.hash(senha, 10);

    const user = {
      idUser: idUser,
      nome: nome,
      email: email,
      senha: senhaEncrypt,
      funcao: null,
    };

    await UserModel.create(user);
    return res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});


// Rotas autenticadas:

// Rota para obter todos os usuario
userController.get("/listarUsuarios", auth, async (req, res) => {
  try {
    let usuarios = await UserModel.find();
    return res.status(200).json(usuarios);
  } catch (err) {
    console.log(`Erro ao buscar usuários. ${err}`);
    return res.status(500).json({ error: err });
  }
});

// Rota para obter user por funcao
userController.get("/usuariosPorFuncao", auth, async (req, res) => {
  try {
    const usuariosPorFuncao = await UserModel.aggregate([
      {
        $group: {
          _id: "$funcao",
          total: { $sum: 1 }, // Total de user por funcao
        },
      },
    ]);

    const totalUsuarios = await UserModel.countDocuments();

    return res.status(200).json({ usuariosPorFuncao, totalUsuarios });
  } catch (error) {
    console.log(`Erro ao buscar usuários por função. ${error}`);
    return res.status(500).json({ error: error });
  }
});

// Rota para obter um user pelo email
userController.get("/:email", auth, async (req, res) => {
  var email = req.params.email;

  try {
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ mensagem: "Usuário não encontrado /:email" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(`Um erro ocorreu ao buscar usuários. ${err}`);
    return res.status(500).json({ error: err });
  }
});

userController.delete("/:idUser", auth, async (req, res) => {
  const idUser = req.params.idUser; // Captura o idUser
  try {
  
    const user = await UserModel.findOne({ idUser: idUser });
    // Se o usuário não existir:
    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    // Se existir: Remove o usuário
    await UserModel.findOneAndDelete({ idUser: idUser });
    // Retorna uma mensagem de sucesso
    return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error(`Um erro ocorreu ao deletar o usuário. ${err}`);
    return res.status(500).json({ error: err });
  }
});



// Rota autenticada para cadastro de usuários
userController.post("/cadastroUsuarioAutenticada", auth, async (req, res) => {
  const { nome, email, senha, funcao } = req.body;

  try {
    let idUser = generateId();
    let userExistente = await UserModel.findOne({ idUser: idUser });

    // Verificar se o idUser já existe e tentar novamente até encontrar um único
    while (userExistente) {
      idUser = generateId();
      userExistente = await UserModel.findOne({ idUser: idUser });
    }

    const usuarioExistente = await UserModel.findOne({
      $or: [{ nome: nome }, { email: email }],
    });
    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Nome de usuário ou email já existe!",
      });
    }

    const senhaEncrypt = await bcryptjs.hash(senha, 10);
    const funcaoNome = funcoes[funcao];

    if (!funcaoNome) {
      return res.status(400).json({
        mensagem: "Função inválida!",
      });
    }

    const user = {
      idUser: idUser,
      nome: nome,
      email: email,
      senha: senhaEncrypt,
      funcao: funcaoNome,
    };

    await UserModel.create(user);
    return res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});


// Rota para editar usuario:
userController.put("/editarUsuario/:email", auth, async (req, res) => {
  const userEmail = req.params.email;
  const { nome, email, senha, funcao } = req.body;

  try {
    // Verifica se o usuário existe através do email
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Atualiza os campos do usuário
    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (senha) {
      const senhaEncrypt = await bcryptjs.hash(senha, 10);
      user.senha = senhaEncrypt;
    }
    if (funcao) {
      const funcaoNome = funcoes[funcao];
      if (!funcaoNome) {
        return res.status(400).json({ mensagem: "Função inválida" });
      }
      user.funcao = funcaoNome;
    }

    // Salva as alterações
    await user.save();

    return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error(`Um erro ocorreu ao editar o usuário. ${error}`);
    return res.status(500).json({ error: error });
  }
});

module.exports = userController;