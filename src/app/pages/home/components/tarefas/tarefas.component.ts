import { Component } from '@angular/core';

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.css']
})
export class TarefasComponent {
  
  task = [
    { description: 'Tarefa 1', status: 'Não concluída', editing: false },
    { description: 'Tarefa 2', status: 'Não concluída', editing: false },
    { description: 'Tarefa 3', status: 'Não concluída', editing: false },
    { description: 'Tarefa 4', status: 'Não concluída', editing: false },
    { description: 'Tarefa 5', status: 'Não concluída', editing: false }
  ];

  botaoConcluir(task: any){
    if (task.status === 'Não concluída') {
      task.status = 'Realizando';
    } else if (task.status === 'Realizando') {
      task.status = 'Concluída';
    } else {
      task.status = 'Não concluída';
    }
  }

  editarTarefa(task: any) {
    task.editing = !task.editing;
  }

  salvarEdicao(task: any) {
    task.editing = false; // Saia do modo de edição
  }
}
