import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  auth = inject(Auth);
  scheduleService = inject(ScheduleService);
  children: any[] = [];
  loading = true;

  async ngOnInit() {
    await this.loadChildren();
    this.loading = false;
  }

  async loadChildren() {
    const parentId = this.auth.currentUser?.uid;
    if (!parentId) return;

    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (response.ok) {
      const data = await response.json();
      const students = data.documents?.filter((doc: any) => 
        doc.fields.role?.stringValue === 'student' && 
        doc.fields.parentId?.stringValue === parentId
      ).map((doc: any) => ({
        uid: doc.fields.uid.stringValue,
        name: doc.fields.name.stringValue,
        email: doc.fields.email.stringValue
      })) || [];

      for (const student of students) {
        const attendance = await this.scheduleService.getStudentAttendance(student.uid);
        const presentCount = attendance.filter(a => a.status === 'present').length;
        const absentCount = attendance.filter(a => a.status === 'absent').length;
        const total = attendance.length;
        student.presentCount = presentCount;
        student.absentCount = absentCount;
        student.attendancePercentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
      }

      this.children = students;
    }
  }
}
