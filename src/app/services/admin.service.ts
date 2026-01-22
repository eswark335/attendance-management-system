import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserData, UserRole } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private auth = inject(Auth);

  async getAllUsers(): Promise<UserData[]> {
    try {
      const token = await this.auth.currentUser?.getIdToken();
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.documents?.map((doc: any) => ({
          uid: doc.fields.uid.stringValue,
          email: doc.fields.email.stringValue,
          role: doc.fields.role.stringValue as UserRole,
          name: doc.fields.name.stringValue
        })) || [];
      }
      return [];
    } catch (error) {
      console.error('getAllUsers error:', error);
      return [];
    }
  }

  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      const token = await this.auth.currentUser?.getIdToken();
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users/${uid}?updateMask.fieldPaths=role`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              role: { stringValue: role }
            }
          })
        }
      );
    } catch (error) {
      console.error('updateUserRole error:', error);
    }
  }
}
