import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/home/components/users/users.component';
import { WelcomeComponent } from './pages/home/components/welcome/welcome.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TarefasComponent } from './pages/home/components/tarefas/tarefas.component';

const routes: Routes = [
  {path: "", redirectTo: "/login", pathMatch: 'full'},
  {path: "login", component: LoginComponent},
  {path: "cadastro", component: SignupComponent},
 
  {
    path: "app", component: HomeComponent,
    children: [
      {path: "", component: WelcomeComponent},
      {path: "users", component: UsersComponent},
      {path: "tarefas", component: TarefasComponent},
    ]
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
