import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

export interface Mark {
  markId: string;
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  examType: string;
  date: string;
  addedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private auth = inject(Auth);

  async addMarks(studentId: string, subject: string, marks: number, maxMarks: number, examType: string): Promise<void> {
    const token = await this.auth.currentUser?.getIdToken();
    const markId = `mark_${Date.now()}_${studentId}`;
    
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/marks?documentId=${markId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            markId: { stringValue: markId },
            studentId: { stringValue: studentId },
            subject: { stringValue: subject },
            marks: { integerValue: marks.toString() },
            maxMarks: { integerValue: maxMarks.toString() },
            examType: { stringValue: examType },
            date: { stringValue: new Date().toISOString().split('T')[0] },
            addedBy: { stringValue: this.auth.currentUser?.uid || '' }
          }
        })
      }
    );
  }

  async getStudentMarks(studentId: string): Promise<Mark[]> {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/marks`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.documents?.filter((doc: any) => 
        doc.fields.studentId.stringValue === studentId
      ).map((doc: any) => ({
        markId: doc.fields.markId.stringValue,
        studentId: doc.fields.studentId.stringValue,
        subject: doc.fields.subject.stringValue,
        marks: parseInt(doc.fields.marks.integerValue),
        maxMarks: parseInt(doc.fields.maxMarks.integerValue),
        examType: doc.fields.examType.stringValue,
        date: doc.fields.date.stringValue,
        addedBy: doc.fields.addedBy.stringValue
      })) || [];
    }
    return [];
  }

  async getAllMarks(): Promise<Mark[]> {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/marks`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.documents?.map((doc: any) => ({
        markId: doc.fields.markId.stringValue,
        studentId: doc.fields.studentId.stringValue,
        subject: doc.fields.subject.stringValue,
        marks: parseInt(doc.fields.marks.integerValue),
        maxMarks: parseInt(doc.fields.maxMarks.integerValue),
        examType: doc.fields.examType.stringValue,
        date: doc.fields.date.stringValue,
        addedBy: doc.fields.addedBy.stringValue
      })) || [];
    }
    return [];
  }
}
