import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { ManageClasses } from './manage-classes/manage-classes';
import { ManageSchedules } from './manage-schedules/manage-schedules';
import { ViewReports } from './view-reports/view-reports';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'classes', component: ManageClasses },
  { path: 'schedules', component: ManageSchedules },
  { path: 'view-reports', component: ViewReports }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HodRoutingModule { }
