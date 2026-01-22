import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

export interface Schedule {
  scheduleId: string;
  classId: string;
  professorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject: string;
  createdBy: string;
}

export interface Attendance {
  attendanceId: string;
  studentId: string;
  classId: string;
  scheduleId: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
  markedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private auth = inject(Auth);

  async createSchedule(schedule: Omit<Schedule, 'scheduleId' | 'createdBy'>): Promise<void> {
    const token = await this.auth.currentUser?.getIdToken();
    const scheduleId = `sch_${Date.now()}`;
    
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/schedules?documentId=${scheduleId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            scheduleId: { stringValue: scheduleId },
            classId: { stringValue: schedule.classId },
            professorId: { stringValue: schedule.professorId },
            dayOfWeek: { stringValue: schedule.dayOfWeek },
            startTime: { stringValue: schedule.startTime },
            endTime: { stringValue: schedule.endTime },
            subject: { stringValue: schedule.subject },
            createdBy: { stringValue: this.auth.currentUser?.uid || '' }
          }
        })
      }
    );
  }

  async getAllSchedules(): Promise<Schedule[]> {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/schedules`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.documents?.map((doc: any) => ({
        scheduleId: doc.fields.scheduleId.stringValue,
        classId: doc.fields.classId.stringValue,
        professorId: doc.fields.professorId.stringValue,
        dayOfWeek: doc.fields.dayOfWeek.stringValue,
        startTime: doc.fields.startTime.stringValue,
        endTime: doc.fields.endTime.stringValue,
        subject: doc.fields.subject.stringValue,
        createdBy: doc.fields.createdBy.stringValue
      })) || [];
    }
    return [];
  }

  async getProfessorSchedules(professorId: string): Promise<Schedule[]> {
    const allSchedules = await this.getAllSchedules();
    return allSchedules.filter(s => s.professorId === professorId);
  }

  async markAttendance(studentId: string, classId: string, scheduleId: string, status: 'present' | 'absent'): Promise<void> {
    const token = await this.auth.currentUser?.getIdToken();
    const attendanceId = `att_${Date.now()}_${studentId}`;
    const today = new Date().toISOString().split('T')[0];
    
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/attendance?documentId=${attendanceId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            attendanceId: { stringValue: attendanceId },
            studentId: { stringValue: studentId },
            classId: { stringValue: classId },
            scheduleId: { stringValue: scheduleId },
            date: { stringValue: today },
            status: { stringValue: status },
            markedBy: { stringValue: this.auth.currentUser?.uid || '' },
            markedAt: { stringValue: new Date().toISOString() }
          }
        })
      }
    );
  }

  async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    const token = await this.auth.currentUser?.getIdToken();
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/attendance-management/documents/attendance`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.documents?.filter((doc: any) => 
        doc.fields.studentId.stringValue === studentId
      ).map((doc: any) => ({
        attendanceId: doc.fields.attendanceId.stringValue,
        studentId: doc.fields.studentId.stringValue,
        classId: doc.fields.classId.stringValue,
        scheduleId: doc.fields.scheduleId.stringValue,
        date: doc.fields.date.stringValue,
        status: doc.fields.status.stringValue as 'present' | 'absent',
        markedBy: doc.fields.markedBy.stringValue,
        markedAt: doc.fields.markedAt.stringValue
      })) || [];
    }
    return [];
  }
}
