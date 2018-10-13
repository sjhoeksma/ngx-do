/** CoreGlobalModule
This packages should only be loaded ones, otherwise the providers are created more times 
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreConfig} from './core.config';
import { CoreEvent} from './core.event';
import { CoreAuth } from './core.auth';
import { CoreModule} from './core.module'

@NgModule({
    declarations: [
    ],
    imports: [
      CoreModule,
    ],
    exports: [
      CoreModule,
    ],
    providers: [
       CoreConfig,
       CoreEvent,
       CoreAuth,
    ]
})
export class CoreGlobalModule {}
