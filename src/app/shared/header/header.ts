import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  auth = inject(Auth);
  router = inject(Router);
  user$ = this.authService.user$;

  async goHome() {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      const userData = await this.authService.getUserData(uid);
      if (userData) {
        this.router.navigate([`/${userData.role}`]);
      }
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
