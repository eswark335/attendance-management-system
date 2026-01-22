import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { MarksService } from '../../services/marks.service';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-report-card',
  imports: [CommonModule],
  templateUrl: './report-card.html',
  styleUrl: './report-card.css',
})
export class ReportCard implements OnInit {
  auth = inject(Auth);
  router = inject(Router);
  marksService = inject(MarksService);
  scheduleService = inject(ScheduleService);
  
  studentData: any = null;
  marks: any[] = [];
  attendance: any = { present: 0, absent: 0, percentage: 0 };
  loading = true;
  today = new Date();

  async ngOnInit() {
    const studentId = this.auth.currentUser?.uid;
    if (studentId) {
      await this.loadStudentData(studentId);
      await this.loadMarks(studentId);
      await this.loadAttendance(studentId);
    }
    this.loading = false;
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

  goBack() {
    this.router.navigate(['/student']);
  }

  printReport() {
    window.print();
  }

  downloadReport() {
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
