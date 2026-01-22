import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { MarksService } from '../../services/marks.service';
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-add-marks',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-marks.html',
  styleUrl: './add-marks.css',
})
export class AddMarks implements OnInit {
  auth = inject(Auth);
  router = inject(Router);
  marksService = inject(MarksService);
  classService = inject(ClassService);
  
  students: any[] = [];
  myClasses: any[] = [];
  selectedClassId = '';
  selectedStudentId = '';
  subject = '';
  marks = 0;
  maxMarks = 100;
  examType = 'Mid-Term';
  loading = true;
  submitting = false;
  
  examTypes = ['Mid-Term', 'Final', 'Quiz', 'Assignment', 'Project'];

  async ngOnInit() {
    const professorId = this.auth.currentUser?.uid;
    if (professorId) {
      this.myClasses = await this.classService.getProfessorClasses(professorId);
    }
    this.loading = false;
  }

  goBack() {
    this.router.navigate(['/professor']);
  }

  async onClassChange() {
    if (!this.selectedClassId) {
      this.students = [];
      return;
    }

    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    if (response.ok) {
      const data = await response.json();
      this.students = data.documents?.filter((doc: any) => 
        doc.fields.role?.stringValue === 'student' && 
        doc.fields.classId?.stringValue === this.selectedClassId
      ).map((doc: any) => ({
        uid: doc.fields.uid.stringValue,
        name: doc.fields.name.stringValue,
        email: doc.fields.email.stringValue
      })) || [];
    }
  }

  async submitMarks() {
    if (!this.selectedStudentId || !this.subject) {
      alert('Please fill all fields');
      return;
    }

    this.submitting = true;
    try {
      await this.marksService.addMarks(
        this.selectedStudentId,
        this.subject,
        this.marks,
        this.maxMarks,
        this.examType
      );
      alert('Marks added successfully!');
      this.selectedStudentId = '';
      this.subject = '';
      this.marks = 0;
      this.maxMarks = 100;
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
    this.submitting = false;
  }
}
