import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassService, Class } from '../../services/class.service';
import { AdminService } from '../../services/admin.service';
import { ScheduleService } from '../../services/schedule.service';
import { UserData } from '../../services/auth.service';

@Component({
  selector: 'app-manage-schedules',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-schedules.html',
  styleUrl: './manage-schedules.css',
})
export class ManageSchedules implements OnInit {
  classService = inject(ClassService);
  adminService = inject(AdminService);
  scheduleService = inject(ScheduleService);
  router = inject(Router);
  
  classes: Class[] = [];
  professors: UserData[] = [];
  schedules: any[] = [];
  showAddSchedule = false;
  loading = true;
  
  newSchedule = {
    classId: '',
    professorId: '',
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    subject: ''
  };
  
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  async ngOnInit() {
    await this.loadData();
    this.loading = false;
  }

  goBack() {
    this.router.navigate(['/hod']);
  }

  async loadData() {
    this.classes = await this.classService.getAllClasses();
    const allUsers = await this.adminService.getAllUsers();
    this.professors = allUsers.filter(u => u.role === 'professor');
    this.schedules = await this.scheduleService.getAllSchedules();
  }

  async addSchedule() {
    if (!this.newSchedule.classId || !this.newSchedule.professorId) return;
    await this.scheduleService.createSchedule(this.newSchedule);
    this.showAddSchedule = false;
    this.newSchedule = { classId: '', professorId: '', dayOfWeek: 'Monday', startTime: '', endTime: '', subject: '' };
    await this.loadData();
    alert('Schedule created successfully!');
  }

  getClassName(classId: string): string {
    return this.classes.find(c => c.classId === classId)?.className || 'Unknown';
  }

  getProfessorName(professorId: string): string {
    return this.professors.find(p => p.uid === professorId)?.name || 'Unknown';
  }
}
