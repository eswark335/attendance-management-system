import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { MarksService } from '../../services/marks.service';
import { ScheduleService } from '../../services/schedule.service';
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-view-reports',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-reports.html',
  styleUrl: './view-reports.css',
})
export class ViewReports implements OnInit {
  auth = inject(Auth);
  router = inject(Router);
  marksService = inject(MarksService);
  scheduleService = inject(ScheduleService);
  classService = inject(ClassService);
  
  allClasses: any[] = [];
  students: any[] = [];
  selectedClassId = '';
  selectedStudentId = '';
  studentData: any = null;
  marks: any[] = [];
  attendance: any = { present: 0, absent: 0, percentage: 0 };
  loading = true;
  showReport = false;
  today = new Date();

  async ngOnInit() {
    this.allClasses = await this.classService.getAllClasses();
    this.loading = false;
  }

  goBack() {
    this.router.navigate(['/hod']);
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

  async viewReport() {
    if (!this.selectedStudentId) {
      alert('Please select a student');
      return;
    }

    await this.loadStudentData(this.selectedStudentId);
    await this.loadMarks(this.selectedStudentId);
    await this.loadAttendance(this.selectedStudentId);
    this.showReport = true;
  }

  async loadStudentData(studentId: string) {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users/${studentId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    if (response.ok) {
      const data = await response.json();
      this.studentData = {
        name: data.fields.name.stringValue,
        email: data.fields.email.stringValue,
        classId: data.fields.classId?.stringValue || 'N/A',
        parentEmail: data.fields.parentEmail?.stringValue || 'N/A'
      };
    }
  }

  async loadMarks(studentId: string) {
    this.marks = await this.marksService.getStudentMarks(studentId);
  }

  async loadAttendance(studentId: string) {
    const records = await this.scheduleService.getStudentAttendance(studentId);
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const total = records.length;
    this.attendance = {
      present,
      absent,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  printReport() {
    window.print();
  }

  get totalMarks() {
    return this.marks.reduce((sum, m) => sum + m.marks, 0);
  }

  get totalMaxMarks() {
    return this.marks.reduce((sum, m) => sum + m.maxMarks, 0);
  }

  get overallPercentage() {
    return this.totalMaxMarks > 0 ? Math.round((this.totalMarks / this.totalMaxMarks) * 100) : 0;
  }

  get grade() {
    const per = this.overallPercentage;
    if (per >= 90) return 'A+';
    if (per >= 80) return 'A';
    if (per >= 70) return 'B';
    if (per >= 60) return 'C';
    if (per >= 50) return 'D';
    return 'F';
  }
}
