import { NgModule } from '@angular/core';
import {
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatListModule,
       } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShowdownModule, ConverterOptions, IConverterOptions } from 'ngx-showdown';
import { SurveyModule } from 'ngx-do-survey';

import { DoWidgetsRouterModule } from './do-widgets.routes';
import { SurveyComponent } from './survey/survey.component';
import { SurveyEditorComponent } from './survey-editor/survey-editor.component';

@NgModule({
    imports: [
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatListModule,
        MatChipsModule,
        SurveyModule,
        ShowdownModule.forRoot({} as ConverterOptions | IConverterOptions),
        DoWidgetsRouterModule ],
    declarations: [
        SurveyComponent,
        SurveyEditorComponent,
    ],
    exports: [
    ],
    providers: [
    ]
})
export class DoWidgetsModule {
}
