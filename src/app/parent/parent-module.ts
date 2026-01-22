import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { ViewChildReport } from './view-child-report/view-child-report';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ParentRoutingModule,
    Dashboard,
    ViewChildReport
  ]
})
export class ParentModule { }
