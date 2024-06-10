const bcryptjs = require("bcryptjs");
const auth = require("../../middlewares/authentication");
const TodoList = require("../../models/TodoList");
const express = require("express");
const todoListController = express.Router();

function generateId() {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Status de tarefa
const statusTarefa = {
  1: "Não iniciado",
  2: "Em andamento",
  3: "Concluído",
};

// GET: retorna todas as tarefas
todoListController.get("/", auth, async (req, res) => {
  try {
    const tarefas = await TodoList.find({});
    return res.status(200).json(tarefas);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Erro ao buscar tarefas", error: error.message });
  }
});

// Listar tarefas do usuário logado
todoListController.get(
  "/tarefasPorUsuario/:usuarioAtribuido",
  auth,
  async (req, res) => {
    try {
      const idUsuarioAtribuido = req.params.usuarioAtribuido;
      const tarefas = await TodoList.find({
        usuarioAtribuido: idUsuarioAtribuido,
      });

      return res.status(200).json(tarefas);
    } catch (error) {
      return res
        .status(500)
        .json({
          mensagem: "Erro ao buscar tarefas do usuário atribuído",
          error: error.message,
        });
    }
  }
);

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
        mensagem: "Status inválido!",
      });
    }

    const newTask = new TodoList({
      tarefaId: tarefaId,
      tarefaDescricao: tarefaDescricao,
      usuarioAtribuido: usuarioAtribuido || null,
      tarefaStatus: statusTarefaNome,
    });

    await newTask.save();
    return res.status(201).json({
      mensagem: "Tarefa criada com sucesso!",
      tarefa: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Editar tarefa do usuario logado
todoListController.put("/editar/:tarefaId", auth, async (req, res) => {
  const { tarefaId } = req.params;
  const tarefaUpdates = req.body;

  try {
    const tarefa = await TodoList.findOne({ tarefaId: tarefaId });

    if (!tarefa) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

    await TodoList.updateOne({ tarefaId: tarefaId }, tarefaUpdates);

    const updatedTarefa = await TodoList.findOne({ tarefaId: tarefaId });

    return res.status(200).json(updatedTarefa);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Deletar uma tarefa específica pelo tarefaId
todoListController.delete("/excluir/:tarefaId", auth, async (req, res) => {
  const { tarefaId } = req.params;

  try {
    const tarefa = await TodoList.findOne({ tarefaId: tarefaId });

    if (!tarefa) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

    await TodoList.deleteOne({ tarefaId: tarefaId });

    return res.status(200).json({ mensagem: "Tarefa excluída com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Listar tarefas não atribuídas
todoListController.get("/tarefasNaoAtribuidas", auth, async (req, res) => {
  try {
    const tarefas = await TodoList.find({ usuarioAtribuido: null });
    return res.status(200).json(tarefas);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Adicionar dono a uma tarefa específica
todoListController.put("/atribuirTarefa/:tarefaId", auth, async (req, res) => {
  const { tarefaId } = req.params;
  const { usuarioAtribuido } = req.body;

  try {
    const tarefa = await TodoList.findOne({ tarefaId: tarefaId });
    if (!tarefa) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

    tarefa.usuarioAtribuido = usuarioAtribuido;
    await tarefa.save();

    return res.status(200).json({
      mensagem: "Usuário atribuído à tarefa com sucesso!",
      tarefa: tarefa,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = todoListController;
