import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule,
        MatToolbarModule,
        MatSidenavModule} from '@angular/material';
import { PerfectScrollbarModule ,
        PERFECT_SCROLLBAR_CONFIG ,
        PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxDoCoreModule,
        NgxDoModule,
        NgxDoUiModule,
        DoComponent,
        GatewayAuth
       } from 'ngx-do';
import { NgxDoPagesModule } from 'ngx-do-pages'
import { NgxDoWipModule } from 'ngx-do-wip';
import { NgxDoAiModule } from 'ngx-do-ai';
import { NgxDoSurveyModule } from 'ngx-do-survey'
import { AppComponent } from './app.component';
import { BackendService } from './backend/backend.service';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { AppRoutesModule } from './app.routes';

import { HighlightModule} from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'scss', func: scss},
    {name: 'xml', func: xml}
  ];
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

// Function for setting the default restangular configuration
export function RestangularConfigFactory (RestangularProvider) {
}

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatSidenavModule,
        PerfectScrollbarModule,
        HighlightModule.forRoot({ languages: hljsLanguages}),
        RestangularModule.forRoot(RestangularConfigFactory),
        NgxDoModule,
        NgxDoCoreModule,
        NgxDoUiModule,
        NgxDoPagesModule,
        NgxDoWipModule,
        NgxDoSurveyModule,
        NgxDoAiModule,
        AppRoutesModule,
    ],
    declarations: [AppComponent],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        BackendService
    ],
   bootstrap: [
    DoComponent
   ]
})
export class AppModule { 
 constructor(private gateway: GatewayAuth){}
}
