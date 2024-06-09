const express = require("express");
const todoRouter = express.Router();
const { TodoList } = require("../models/TodoList");
const [ UserModel ] = require("../models/User");

// Listar as tarefas do usuário logado


// Editar uma tarefa específica do usuário logado


// Excluir uma tarefa específica do usuário logado


// Criar uma nova tarefa


// Tarefas sem dono


// Adicionar um dono a uma tarefa específica


module.exports = todoRouter;