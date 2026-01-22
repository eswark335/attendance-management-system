import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorRoutingModule } from './professor-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { MarkAttendance } from './mark-attendance/mark-attendance';
import { AddMarks } from './add-marks/add-marks';
import { ViewReports } from './view-reports/view-reports';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfessorRoutingModule,
    Dashboard,
    MarkAttendance,
    AddMarks,
    ViewReports
  ]
})
export class ProfessorModule { }
