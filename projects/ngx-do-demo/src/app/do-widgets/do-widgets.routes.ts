import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreAuth } from 'ngx-do-cdk';

import { SurveyComponent } from './survey/survey.component';

const widgetsRoutes: Routes = [
    //These are public sides
  	
    { path: 'survey', component: SurveyComponent ,data: { animation: 'survey'}
      ,canActivate:[CoreAuth]
    },
];

@NgModule({
  imports: [
    RouterModule.forChild(widgetsRoutes)
  	],
  exports: [
    RouterModule
  ]
})
export class DoWidgetsRouterModule {}