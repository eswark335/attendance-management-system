import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MarkAttendance } from './mark-attendance/mark-attendance';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'attendance', component: MarkAttendance }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }
