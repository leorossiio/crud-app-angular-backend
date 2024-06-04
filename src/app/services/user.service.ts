import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user = new BehaviorSubject<any>({});
  currentUser = this.user.asObservable();
  users = [
    {
      email: 'admin',
      senha: '1234'
    }
  ];

  constructor() { }

  addUser(newUser: any) {
    this.users.push(newUser);
  }

  getUsers() {
    return this.users;
  }
}
