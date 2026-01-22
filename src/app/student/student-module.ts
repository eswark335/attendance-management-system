import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { MyAttendance } from './my-attendance/my-attendance';
import { ReportCard } from './report-card/report-card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentRoutingModule,
    Dashboard,
    MyAttendance,
    ReportCard
  ]
})
export class StudentModule { }
