import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreAuth } from 'ngx-do-cdk';

import { SurveyComponent } from './survey/survey.component';
import { SurveyEditorComponent } from './survey-editor/survey-editor.component';
import { NodeRedComponent } from './node-red/node-red.component';

const widgetsRoutes: Routes = [
    //These are public sides
  	
    { path: 'survey', component: SurveyComponent ,data: { animation: 'survey'}
      ,canActivate:[CoreAuth]
    },
   { path: 'survey-editor', component: SurveyEditorComponent ,data: { animation: 'survey-editor'}
      ,canActivate:[CoreAuth]
    },
   { path: 'nodered', component: NodeRedComponent ,data: { animation: 'nodered','expectedRole': 'node-red'}
      ,canActivate:[CoreAuth]
    }
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