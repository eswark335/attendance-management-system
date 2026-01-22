import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ClassService, Class } from '../../services/class.service';
import { ScheduleService, Schedule } from '../../services/schedule.service';
import { environment } from '../../../environments/environment';
import { UserData } from '../../services/auth.service';

@Component({
  selector: 'app-mark-attendance',
  imports: [CommonModule, FormsModule],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.css',
})
export class MarkAttendance implements OnInit {
  auth = inject(Auth);
  router = inject(Router);
  classService = inject(ClassService);
  scheduleService = inject(ScheduleService);
  
  myClasses: Class[] = [];
  mySchedules: Schedule[] = [];
  students: UserData[] = [];
  selectedClassId = '';
  selectedScheduleId = '';
  attendanceMap: { [studentId: string]: 'present' | 'absent' } = {};
  loading = true;
  loadingStudents = false;
  submitting = false;

  async ngOnInit() {
    const professorId = this.auth.currentUser?.uid;
    if (professorId) {
      this.myClasses = await this.classService.getProfessorClasses(professorId);
      this.mySchedules = await this.scheduleService.getProfessorSchedules(professorId);
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
    
    this.loadingStudents = true;
    console.log('Loading students for class:', this.selectedClassId);
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/users`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('All users:', data.documents?.length);
      
      this.students = data.documents?.filter((doc: any) => {
        const isStudent = doc.fields.role?.stringValue === 'student';
        const matchesClass = doc.fields.classId?.stringValue === this.selectedClassId;
        console.log('User:', doc.fields.name?.stringValue, 'isStudent:', isStudent, 'matchesClass:', matchesClass);
        return isStudent && matchesClass;
      }).map((doc: any) => ({
        uid: doc.fields.uid.stringValue,
        email: doc.fields.email.stringValue,
        role: doc.fields.role.stringValue,
        name: doc.fields.name.stringValue
      })) || [];
      
      console.log('Filtered students:', this.students.length);
      this.students.forEach(s => this.attendanceMap[s.uid] = 'present');
    }
    this.loadingStudents = false;
  }

  async submitAttendance() {
    if (!this.selectedScheduleId) {
      alert('Please select a schedule');
      return;
    }
    
    this.submitting = true;
    for (const student of this.students) {
      await this.scheduleService.markAttendance(
        student.uid,
        this.selectedClassId,
        this.selectedScheduleId,
        this.attendanceMap[student.uid]
      );
    }
    
    this.submitting = false;
    alert('Attendance marked successfully!');
    this.selectedClassId = '';
    this.selectedScheduleId = '';
    this.students = [];
  }

  get filteredSchedules(): Schedule[] {
    return this.mySchedules.filter(s => s.classId === this.selectedClassId);
  }
}
