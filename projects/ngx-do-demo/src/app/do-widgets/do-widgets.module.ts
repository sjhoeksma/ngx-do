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
import { WidgetsModule } from 'ngx-do-cdk';

import { DoWidgetsRouterModule } from './do-widgets.routes';
import { SurveyComponent } from './survey/survey.component';

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
        WidgetsModule,
        ShowdownModule.forRoot({} as ConverterOptions | IConverterOptions),
        DoWidgetsRouterModule ],
    declarations: [   
        SurveyComponent,
    ],
    exports: [
    ],
    providers: [
    ]
})
export class DoWidgetsModule {
}