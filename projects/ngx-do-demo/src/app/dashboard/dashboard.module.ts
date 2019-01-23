import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { NgxDoWipModule } from  'ngx-do-wip';
import { NgxDoPagesModule } from  'ngx-do-pages';

export const appRoutes: Routes = [
    { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    NgxDoWipModule,
    NgxDoPagesModule,
    RouterModule.forChild(appRoutes),
  ],
  declarations: [DashboardComponent],
  exports: [ ]
})
export class DashboardModule { }
