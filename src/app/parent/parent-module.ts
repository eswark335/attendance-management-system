import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing-module';
import { Dashboard } from './dashboard/dashboard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ParentRoutingModule,
    Dashboard
  ]
})
export class ParentModule { }
