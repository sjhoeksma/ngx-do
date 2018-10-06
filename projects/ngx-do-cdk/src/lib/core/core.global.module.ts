/** CoreGlobalModule
This packages should only be loaded ones, otherwise the providers are created more times 
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreConfig} from './core.config';
import { CoreEvent} from './core.event';
import { CoreAuth } from './core.auth';
import { CoreModule} from "./core.module"

// Flexible import definition
let core_flex_imports = [];
let core_flex_providers=[];

// Add Extra depending on mode
/*
if (environment.production) {
  //
} else {
  //
}
*/

@NgModule({

    declarations: [
    ],
    imports: [
      CoreModule,
      ...core_flex_imports,
    ],
    exports: [
      CoreModule,
    ],

    providers: [
       CoreConfig,
       CoreEvent,
       CoreAuth,
        ...core_flex_providers
    ]
})
export class CoreGlobalModule {}
