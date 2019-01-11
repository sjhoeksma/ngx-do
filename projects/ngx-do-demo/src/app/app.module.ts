import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule, 
        MatToolbarModule, 
        MatSidenavModule} from '@angular/material';
import { PerfectScrollbarModule , 
        PERFECT_SCROLLBAR_CONFIG ,
        PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CoreGlobalModule, 
        DoModule, 
        DoComponent,
        CorePreloadingStrategy} from 'ngx-do-cdk';
import { AppComponent } from './app.component';
import { BackendService } from './backend/backend.service';
import { RestangularModule, Restangular } from 'ngx-restangular';

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

import { AppRoutes } from './app.routes';

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule, 
        MatSnackBarModule,
        MatSidenavModule,
        PerfectScrollbarModule,
        DoModule,
        CoreGlobalModule,
          HighlightModule.forRoot({ languages: hljsLanguages}),
        RestangularModule.forRoot(RestangularConfigFactory),
        RouterModule.forRoot(AppRoutes, {preloadingStrategy:CorePreloadingStrategy}),
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
export class AppModule { }
