import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  usuario = {
    email: '',
    nome: '',
    senha: ''
  }

  constructor(private userService: UserService) { }

  cadastrarUsuario(){
    if(this.usuario.email && this.usuario.nome && this.usuario.senha) {
      if(this.usuario.senha.length >= 8) {
        this.userService.addUser(this.usuario);
      } else {
        console.log('A senha deve ter pelo menos 8 caracteres');
      }
    } else {
      console.log('Por favor, preencha todos os campos');
    }
  }
}
