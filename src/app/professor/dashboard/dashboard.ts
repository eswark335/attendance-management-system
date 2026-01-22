import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { UserData } from '../../services/auth.service';
import { ClassService, Class } from '../../services/class.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  auth = inject(Auth);
  classService = inject(ClassService);
  showAddStudent = false;
  showAddParent = false;
  showStudents = false;
  showParents = false;
  
  myClasses: Class[] = [];
  selectedClassId = '';
  newStudent = { name: '', email: '', password: '', parentEmail: '' };
  newParent = { name: '', email: '', password: '' };
  students: any[] = [];
  parents: any[] = [];

  async ngOnInit() {
    await this.loadMyClasses();
    await this.loadUsers();
  }

  async loadMyClasses() {
    const professorId = this.auth.currentUser?.uid;
    if (professorId) {
      this.myClasses = await this.classService.getProfessorClasses(professorId);
    }
  }

  async loadUsers() {
    try {
      const token = await this.auth.currentUser?.getIdToken();
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const users = data.documents?.map((doc: any) => ({
          uid: doc.fields.uid.stringValue,
          email: doc.fields.email.stringValue,
          role: doc.fields.role.stringValue,
          name: doc.fields.name.stringValue,
          parentEmail: doc.fields.parentEmail?.stringValue || '',
          classId: doc.fields.classId?.stringValue || ''
        })) || [];
        
        this.students = users.filter((u: any) => u.role === 'student');
        this.parents = users.filter((u: any) => u.role === 'parent');
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async addStudent() {
    if (!this.selectedClassId) {
      alert('Please select a class first');
      return;
    }

    try {
      // Create student account
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.newStudent.email,
            password: this.newStudent.password,
            returnSecureToken: true
          })
        }
      );

      if (!response.ok) throw new Error('Failed to create student');

      const data = await response.json();
      
      // Find parent by email
      const allUsers = await this.loadAllUsers();
      const parent = allUsers.find(u => u.email === this.newStudent.parentEmail && u.role === 'parent');
      
      // Create user document with classId and parentId
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users/${data.localId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${data.idToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              uid: { stringValue: data.localId },
              email: { stringValue: this.newStudent.email },
              role: { stringValue: 'student' },
              name: { stringValue: this.newStudent.name },
              classId: { stringValue: this.selectedClassId },
              parentId: { stringValue: parent?.uid || '' },
              parentEmail: { stringValue: this.newStudent.parentEmail || '' }
            }
          })
        }
      );

      this.showAddStudent = false;
      this.newStudent = { name: '', email: '', password: '', parentEmail: '' };
      await this.loadUsers();
      alert('Student added successfully!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  async updateStudentParent(student: any) {
    try {
      const token = await this.auth.currentUser?.getIdToken();
      const allUsers = await this.loadAllUsers();
      const parent = allUsers.find(u => u.email === student.parentEmail && u.role === 'parent');
      
      const updateData: any = {
        uid: { stringValue: student.uid },
        email: { stringValue: student.email },
        role: { stringValue: student.role },
        name: { stringValue: student.name },
        parentEmail: { stringValue: student.parentEmail || '' },
        parentId: { stringValue: parent?.uid || '' }
      };

      if (student.classId) {
        updateData.classId = { stringValue: student.classId };
      }
      
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users/${student.uid}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields: updateData })
        }
      );
      
      alert('Parent email updated successfully!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  async loadAllUsers(): Promise<UserData[]> {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.documents?.map((doc: any) => ({
        uid: doc.fields.uid.stringValue,
        email: doc.fields.email.stringValue,
        role: doc.fields.role.stringValue,
        name: doc.fields.name.stringValue
      })) || [];
    }
    return [];
  }

  async addParent() {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.newParent.email,
            password: this.newParent.password,
            returnSecureToken: true
          })
        }
      );

      if (!response.ok) throw new Error('Failed to create parent');

      const data = await response.json();
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users?documentId=${data.localId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${data.idToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              uid: { stringValue: data.localId },
              email: { stringValue: this.newParent.email },
              role: { stringValue: 'parent' },
              name: { stringValue: this.newParent.name }
            }
          })
        }
      );

      this.showAddParent = false;
      this.newParent = { name: '', email: '', password: '' };
      await this.loadUsers();
      alert('Parent added successfully!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }
}
