import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { MyAttendance } from './my-attendance/my-attendance';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentRoutingModule,
    Dashboard,
    MyAttendance
  ]
})
export class StudentModule { }
