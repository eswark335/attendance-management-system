import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);
  
  email = '';
  password = '';
  name = '';
  role: UserRole = 'student';
  error = '';
  roles: UserRole[] = ['student', 'professor', 'parent', 'hod'];

  async register() {
    try {
      const userData = await this.authService.register(this.email, this.password, this.name, this.role);
      this.router.navigate([`/${userData.role}`]);
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
