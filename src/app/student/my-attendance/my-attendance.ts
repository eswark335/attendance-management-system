import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ScheduleService, Attendance } from '../../services/schedule.service';

@Component({
  selector: 'app-my-attendance',
  imports: [CommonModule],
  templateUrl: './my-attendance.html',
  styleUrl: './my-attendance.css',
})
export class MyAttendance implements OnInit {
  auth = inject(Auth);
  router = inject(Router);
  scheduleService = inject(ScheduleService);
  attendanceRecords: Attendance[] = [];
  presentCount = 0;
  absentCount = 0;
  attendancePercentage = 0;
  loading = true;

  async ngOnInit() {
    const studentId = this.auth.currentUser?.uid;
    if (studentId) {
      this.attendanceRecords = await this.scheduleService.getStudentAttendance(studentId);
      this.calculateStats();
    }
    this.loading = false;
  }

  goBack() {
    this.router.navigate(['/student']);
  }

  calculateStats() {
    this.presentCount = this.attendanceRecords.filter(a => a.status === 'present').length;
    this.absentCount = this.attendanceRecords.filter(a => a.status === 'absent').length;
    const total = this.attendanceRecords.length;
    this.attendancePercentage = total > 0 ? Math.round((this.presentCount / total) * 100) : 0;
  }
}
