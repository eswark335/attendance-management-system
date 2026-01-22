import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MarkAttendance } from './mark-attendance/mark-attendance';
import { AddMarks } from './add-marks/add-marks';
import { ViewReports } from './view-reports/view-reports';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'attendance', component: MarkAttendance },
  { path: 'add-marks', component: AddMarks },
  { path: 'view-reports', component: ViewReports }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }
