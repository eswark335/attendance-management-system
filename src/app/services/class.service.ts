import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

export interface Class {
  classId: string;
  className: string;
  createdBy: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private auth = inject(Auth);

  async createClass(className: string): Promise<void> {
    const token = await this.auth.currentUser?.getIdToken();
    const classId = `class_${Date.now()}`;
    
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/classes?documentId=${classId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            classId: { stringValue: classId },
            className: { stringValue: className },
            createdBy: { stringValue: this.auth.currentUser?.uid || '' },
            createdAt: { stringValue: new Date().toISOString() }
          }
        })
      }
    );
  }

  async getAllClasses(): Promise<Class[]> {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/classes`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.documents?.map((doc: any) => ({
        classId: doc.fields.classId.stringValue,
        className: doc.fields.className.stringValue,
        createdBy: doc.fields.createdBy.stringValue,
        createdAt: doc.fields.createdAt.stringValue
      })) || [];
    }
    return [];
  }

  async assignProfessor(classId: string, professorId: string): Promise<void> {
    const token = await this.auth.currentUser?.getIdToken();
    const id = `cp_${Date.now()}`;
    
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/class_professors?documentId=${id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            classId: { stringValue: classId },
            professorId: { stringValue: professorId },
            assignedBy: { stringValue: this.auth.currentUser?.uid || '' },
            assignedAt: { stringValue: new Date().toISOString() }
          }
        })
      }
    );
  }

  async getProfessorClasses(professorId: string): Promise<Class[]> {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/class_professors`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const assignments = data.documents?.filter((doc: any) => 
        doc.fields.professorId.stringValue === professorId
      ) || [];
      
      const classIds = assignments.map((a: any) => a.fields.classId.stringValue);
      const allClasses = await this.getAllClasses();
      return allClasses.filter(c => classIds.includes(c.classId));
    }
    return [];
  }
}
