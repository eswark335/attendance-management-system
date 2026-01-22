import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, enableNetwork } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

export type UserRole = 'student' | 'professor' | 'parent' | 'hod';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  private firestore = inject(Firestore);
  user$ = user(this.auth);

  constructor() {
    enableNetwork(this.firestore).catch(err => console.error('Network enable error:', err));
  }

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return await this.getUserData(credential.user.uid);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      if (result.user) {
        let userData = await this.getUserData(result.user.uid);
        if (!userData && result.user.email) {
          const token = await result.user.getIdToken();
          userData = {
            uid: result.user.uid,
            email: result.user.email,
            role: 'student',
            name: result.user.displayName || 'User'
          };
          await fetch(
            `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users?documentId=${result.user.uid}`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                fields: {
                  uid: { stringValue: userData.uid },
                  email: { stringValue: userData.email },
                  role: { stringValue: userData.role },
                  name: { stringValue: userData.name },
                  classId: { stringValue: 'default_class' }
                }
              })
            }
          );
        }
        return userData;
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
    return null;
  }

async register(email: string, password: string, name: string, role: UserRole) {
  try {
    console.log('Step 1: Creating user in Authentication...');
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    console.log('Step 2: User created with UID:', credential.user.uid);

    await new Promise(resolve => setTimeout(resolve, 1000));
    const token = await credential.user.getIdToken(true);
    console.log('Step 3: Got auth token');

    const userData: UserData = {
      uid: credential.user.uid,
      email,
      role,
      name
    };

    console.log('Step 4: Attempting to write to Firestore...', userData);
    
    const fields: any = {
      uid: { stringValue: userData.uid },
      email: { stringValue: userData.email },
      role: { stringValue: userData.role },
      name: { stringValue: userData.name }
    };

    if (role === 'student') {
      fields.classId = { stringValue: 'default_class' };
    }
    
    // Use REST API to write
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users?documentId=${credential.user.uid}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      }
    );

    if (response.ok) {
      console.log('Step 5: Successfully written to Firestore');
    } else {
      const error = await response.text();
      console.error('Step 5: Firestore write failed:', response.status, error);
    }

    return userData;

  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}


  async getUserData(uid: string): Promise<UserData | null> {
    try {
      const token = await this.auth.currentUser?.getIdToken();
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users/${uid}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          uid: data.fields.uid.stringValue,
          email: data.fields.email.stringValue,
          role: data.fields.role.stringValue as UserRole,
          name: data.fields.name.stringValue
        };
      }
      return null;
    } catch (error) {
      console.error('getUserData error:', error);
      return null;
    }
  }

  async logout() {
    await signOut(this.auth);
  }
}
