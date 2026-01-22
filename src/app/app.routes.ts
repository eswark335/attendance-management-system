import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { authRedirectGuard } from './guards/auth-redirect.guard';
import { UserManagement } from './admin/user-management/user-management';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [authRedirectGuard] },
  { path: 'register', component: Register, canActivate: [authRedirectGuard] },
  { 
    path: 'student', 
    loadChildren: () => import('./student/student-module').then(m => m.StudentModule), 
    canActivate: [roleGuard(['student'])] 
  },
  { 
    path: 'professor', 
    loadChildren: () => import('./professor/professor-module').then(m => m.ProfessorModule), 
    canActivate: [roleGuard(['professor'])] 
  },
  { 
    path: 'parent', 
    loadChildren: () => import('./parent/parent-module').then(m => m.ParentModule), 
    canActivate: [roleGuard(['parent'])] 
  },
  { 
    path: 'hod', 
    loadChildren: () => import('./hod/hod-module').then(m => m.HodModule), 
    canActivate: [roleGuard(['hod'])] 
  },
  { 
    path: 'admin/users', 
    component: UserManagement, 
    canActivate: [roleGuard(['hod'])] 
  }
];
