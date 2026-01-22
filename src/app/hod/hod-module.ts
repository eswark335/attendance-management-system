import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HodRoutingModule } from './hod-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { ManageClasses } from './manage-classes/manage-classes';
import { ManageSchedules } from './manage-schedules/manage-schedules';
import { ViewReports } from './view-reports/view-reports';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HodRoutingModule,
    Dashboard,
    ManageClasses,
    ManageSchedules,
    ViewReports
  ]
})
export class HodModule { }
