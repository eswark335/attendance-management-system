import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClassService, Class } from '../../services/class.service';
import { AdminService } from '../../services/admin.service';
import { UserData } from '../../services/auth.service';

@Component({
  selector: 'app-manage-classes',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-classes.html',
  styleUrl: './manage-classes.css',
})
export class ManageClasses implements OnInit {
  classService = inject(ClassService);
  adminService = inject(AdminService);
  router = inject(Router);
  
  classes: Class[] = [];
  professors: UserData[] = [];
  showAddClass = false;
  showAssignProfessor = false;
  selectedClassId = '';
  loading = true;
  
  newClassName = '';
  selectedProfessorId = '';

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
  }

  async addClass() {
    if (!this.newClassName) return;
    await this.classService.createClass(this.newClassName);
    this.newClassName = '';
    this.showAddClass = false;
    await this.loadData();
    alert('Class created successfully!');
  }

  openAssignProfessor(classId: string) {
    this.selectedClassId = classId;
    this.showAssignProfessor = true;
  }

  async assignProfessor() {
    if (!this.selectedProfessorId) return;
    await this.classService.assignProfessor(this.selectedClassId, this.selectedProfessorId);
    this.showAssignProfessor = false;
    this.selectedProfessorId = '';
    alert('Professor assigned successfully!');
  }
}
