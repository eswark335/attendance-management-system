import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService, UserData, UserRole } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  adminService = inject(AdminService);
  authService = inject(AuthService);
  users: UserData[] = [];
  roles: UserRole[] = ['student', 'professor', 'parent', 'hod'];
  showAddForm = false;
  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'student' as UserRole
  };

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.adminService.getAllUsers();
  }

  async updateRole(uid: string, role: UserRole) {
    await this.adminService.updateUserRole(uid, role);
    await this.loadUsers();
  }

  async addUser() {
    try {
      // Use Firebase Auth REST API to create user without signing in
      const signUpResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.newUser.email,
            password: this.newUser.password,
            returnSecureToken: true
          })
        }
      );

      if (!signUpResponse.ok) {
        const error = await signUpResponse.json();
        throw new Error(error.error.message);
      }

      const signUpData = await signUpResponse.json();
      const newUserToken = signUpData.idToken;
      const newUserId = signUpData.localId;

      // Create user document in Firestore
      const firestoreResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users?documentId=${newUserId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${newUserToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              uid: { stringValue: newUserId },
              email: { stringValue: this.newUser.email },
              role: { stringValue: this.newUser.role },
              name: { stringValue: this.newUser.name }
            }
          })
        }
      );

      if (!firestoreResponse.ok) {
        console.error('Firestore write failed');
      }

      this.showAddForm = false;
      this.newUser = { name: '', email: '', password: '', role: 'student' };
      await this.loadUsers();
      alert('User created successfully!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }
}
