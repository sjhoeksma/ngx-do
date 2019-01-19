/** CoreGlobalModule
This packages should only be loaded ones, otherwise the providers are created more times
*/
import { NgModule } from '@angular/core';
import { CoreConfig} from './core.config';
import { CoreEvent} from './core.event';
import { CoreAuth } from './core.auth';
import { CoreBackend } from './core.backend';
import { CoreModule} from './core.module';
import { CorePreloadingStrategy } from './core.preloading.strategy';

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
       CoreBackend,
       CorePreloadingStrategy,
    ]
})
export class CoreGlobalModule {}
