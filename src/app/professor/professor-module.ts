import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorRoutingModule } from './professor-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { MarkAttendance } from './mark-attendance/mark-attendance';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfessorRoutingModule,
    Dashboard,
    MarkAttendance
  ]
})
export class ProfessorModule { }
