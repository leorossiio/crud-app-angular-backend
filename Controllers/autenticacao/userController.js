const bcryptjs = require('bcryptjs');
const autenticado = require("../../middlewares/authentication")
const usuarioModel = require("../../models/User");
const express = require('express');
const userController = express.Router();

//Rotas não autenticadas:

// Rota para criar um novo usuário/cliente
userController.post("/cadastroCliente", async (req, res) => {
    const { nome, email, senha } = req.body;

    // Verificar se o nome de usuário ou email já existe
    const usuarioExistente = await usuarioModel.findOne({ $or: [{ nome: nome }, { email: email }] });
    if (usuarioExistente) {
        return res.status(400).json({
            mensagem: "Nome de usuário ou email já existe!"
        });
    }

    const senhaEncrypt = await bcryptjs.hash(senha, 10);
    var user = {
        nome: nome,
        email: email,
        senha: senhaEncrypt,
        funcao: "Não definida"
    };

    try {
        await usuarioModel.create(user);
        return res.status(201).json({
            mensagem: "Usuário criado com sucesso!"
        });
    } catch(error) {
        return res.status(500).json({
            error: error
        });
    }
});





// Rota para obter um usuário pelo email (requer autenticação)
userController.get("/:email", autenticado, async (req, res) => {
    var email = req.params.email;

    try {
        let user = await usuarioModel.findOne({ email: email });
        if(!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });            
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log(`Erro ao buscar usuários. ${err}`);
        return res.status(500).json({ error: err });
    } 
});


//Rotas autenticadas:

// Rota para obter todos os usuários (requer autenticação):
userController.get("/listarUsuarios", autenticado, async (req, res) => {
    try {
        let usuarios = await usuarioModel.find();
        return res.status(200).json(usuarios);
    } catch (err) {
        console.log(`Erro ao buscar usuários. ${err}`);
        return res.status(500).json({ error: err });
    } 
});

//Rotas que possuem a const autenticado são as rotas que requerem autenticação

module.exports = userController;