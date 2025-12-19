import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, CommonModule],
  templateUrl: './app.html',
})
export class App implements OnInit {

  protected readonly title = signal('gestion-hotel');

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const isloggedin = localStorage.getItem('isloggedIn');
    const loggedUser = localStorage.getItem('loggedUser');

    if (isloggedin !== 'true' || !loggedUser) {
      this.router.navigate(['/login']);
    } else {
      this.authService.setLoggedUserFromLocalStorage(loggedUser);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
