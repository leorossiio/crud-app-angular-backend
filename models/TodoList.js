const mongoose = require("mongoose");

const TodoList = mongoose.model("tarefas", {
  tarefaId: Number,
  tarefaTitulo: String,
  tarefaDescricao: String,
  tarefaAcao: Boolean,
  username: String,
});

module.exports = {
  TodoList,
};
