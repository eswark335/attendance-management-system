import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { ViewChildReport } from './view-child-report/view-child-report';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'view-reports', component: ViewChildReport }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }
