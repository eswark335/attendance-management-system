import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authRedirectGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Wait for auth state to initialize
  await new Promise<void>((resolve) => {
    const unsubscribe = authService.auth.onAuthStateChanged(() => {
      unsubscribe();
      resolve();
    });
  });

  const currentUser = authService.auth.currentUser;

  if (currentUser) {
    const userData = await authService.getUserData(currentUser.uid);
    if (userData) {
      router.navigate([`/${userData.role}`]);
      return false;
    }
  }

  return true;
};
