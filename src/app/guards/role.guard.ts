import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return async () => {
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

    if (!currentUser) {
      router.navigate(['/login']);
      return false;
    }

    const userData = await authService.getUserData(currentUser.uid);
    if (userData && allowedRoles.includes(userData.role)) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
};
