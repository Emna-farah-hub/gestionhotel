import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'] // Assuming a CSS file for styling
})
export class ProfileComponent implements OnInit {
  loggedUser: string = '';
  newPassword1: string = '';
  newPassword2: string = '';
  resetPasswordMessage: string = '';

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.loggedUser;
  }

  onLogout(): void {
    this.authService.logout();
  }

  resetPassword(): void {
    if (this.newPassword1 && this.newPassword2 && this.newPassword1 === this.newPassword2) {
      // Placeholder for password reset logic
      // In a real application, you would send this to a backend service
      this.resetPasswordMessage = 'Password reset functionality is a placeholder. In a real app, this would update your password securely.';
      // Clear password fields
      this.newPassword1 = '';
      this.newPassword2 = '';
    } else {
      this.resetPasswordMessage = 'Passwords do not match or are empty.';
    }
  }
}