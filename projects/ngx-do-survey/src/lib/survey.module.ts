import { NgModule } from '@angular/core';
import { SurveyComponent } from './survey/survey.component';
import { SurveyEditorComponent } from './survey-editor/survey-editor.component';
import { ShowdownModule, ConverterOptions, IConverterOptions } from 'ngx-showdown';
import { MatProgressSpinnerModule } from '@angular/material';
import { CommonModule } from '@angular/common';  

@NgModule({
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    ShowdownModule.forRoot({} as ConverterOptions | IConverterOptions),
  ],
  declarations: [
      SurveyComponent,
      SurveyEditorComponent,
      ],
  exports: [
      SurveyComponent,
      SurveyEditorComponent
  ]
})
export class NgxDoSurveyModule { }
