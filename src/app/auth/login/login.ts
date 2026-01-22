import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);
  
  email = '';
  password = '';
  error = '';

  async loginEmail() {
    try {
      const userData = await this.authService.login(this.email, this.password);
      if (userData) {
        this.router.navigate([`/${userData.role}`]);
      }
    } catch (err: any) {
      this.error = err.message;
    }
  }

  async loginGoogle() {
    try {
      const userData = await this.authService.loginWithGoogle();
      if (userData) {
        this.router.navigate([`/${userData.role}`]);
      }
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
