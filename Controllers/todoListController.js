const bcryptjs = require("bcryptjs");
const auth = require("../middlewares/authentication");
const TodoList = require("../models/TodoList");
const express = require("express");
const todoListController = express.Router();

function generateId() {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Status de tarefa
const statusTarefa = {
    1: "Não iniciado",
    2: "Em andamento",
    3: "Concluído"
};

// Criar uma nova tarefa
todoListController.post("/cadastroTarefas", auth, async (req, res) => {
    const { tarefaDescricao, usuarioAtribuido, tarefa } = req.body;

    try {
        let tarefaId = generateId();
        let tarefaExistente = await TodoList.findOne({ tarefaId: tarefaId });

        // Verificar se o tarefaId já existe e tentar novamente até encontrar um único
        while (tarefaExistente) {
            tarefaId = generateId();
            tarefaExistente = await TodoList.findOne({ tarefaId: tarefaId });
        }

        const statusTarefaNome = statusTarefa[parseInt(tarefa)];
        if (!statusTarefaNome) {
            return res.status(400).json({
                mensagem: "Status inválido!"
            });
        }

        const newTask = new TodoList({
            tarefaId: tarefaId,
            tarefaDescricao: tarefaDescricao,
            usuarioAtribuido: usuarioAtribuido || null,
            tarefaStatus: statusTarefaNome
        });

        await newTask.save();
        return res.status(201).json({
            mensagem: "Tarefa criada com sucesso!",
            tarefa: newTask
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

// Listar tarefas do usuário logado
// todoListController.get("/tarefasLogado", auth, async (req, res) => {
//     const usuarioLogadoId = req.user.id; // Supondo que o middleware auth adicione o usuário logado no req.user

//     try {
//         const tarefas = await TodoList.find({ usuarioAtribuido: usuarioLogadoId });
//         return res.status(200).json(tarefas);
//     } catch (error) {
//         return res.status(500).json({
//             error: error.message
//         });
//     }
// });

// Listar tarefas sem dono
todoListController.get("/tarefasNaoAtribuidas", auth, async (req, res) => {
    try {
        const tarefas = await TodoList.find({ usuarioAtribuido: null });
        return res.status(200).json(tarefas);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

module.exports = todoListController;
