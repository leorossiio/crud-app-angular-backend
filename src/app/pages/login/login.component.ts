import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private userService: UserService) {
  }

  email: string = ""
  password: string = ""

  login() {
    let users = this.userService.getUsers();
    let user = users.find(user => user.email === this.email && user.senha === this.password);
    if(user){
      this.router.navigate(["/app"]);
    }
    else if(this.email == '' || this.password == ''){
      alert("Preencha os campos!");
    }
    else{
      alert("Usuário inválido");
      this.email = '';
      this.password = '';
    }
  }
}
