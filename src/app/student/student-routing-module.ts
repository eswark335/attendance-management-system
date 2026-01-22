import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MyAttendance } from './my-attendance/my-attendance';
import { ReportCard } from './report-card/report-card';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'attendance', component: MyAttendance },
  { path: 'report-card', component: ReportCard }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
