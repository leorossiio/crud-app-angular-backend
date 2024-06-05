const bcryptjs = require('bcryptjs');
const auth = require("../../middlewares/authentication");
const usuarioModel = require("../../models/User");
const express = require('express');
const userController = express.Router();

// Rota para obter todos os usuários (requer autenticação)
userController.get("/", auth, async (req, res) => {
    try {
        let usuarios = await usuarioModel.find();
        return res.status(200).json(usuarios);
    } catch (err) {
        console.log(`Erro ao buscar usuários. ${err}`);
        return res.status(500).json({ error: err });
    } 
});

// Rota para criar um novo usuário
userController.post("/", async (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaEncrypt = await bcryptjs.hash(senha, 10);
    var user = {
        nome: nome,
        email: email,
        senha: senhaEncrypt
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
userController.get("/:email", auth, async (req, res) => {
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

module.exports = userController;
