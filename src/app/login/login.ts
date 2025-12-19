import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  user = new User();
  erreur = 0;

  constructor(private authService: AuthService, private router: Router) {}

  onLoggedin() {
    this.authService.SignIn(this.user).subscribe((isValidUser: Boolean) => {
      if (isValidUser) {
      this.router.navigate(['/']);
      } else {
      this.erreur = 1;
      }
    });
  }
}
