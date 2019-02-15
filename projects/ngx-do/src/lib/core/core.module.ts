/** CoreGlobalModule
This packages should only be loaded ones, otherwise the providers are created more times
*/
import { NgModule } from '@angular/core';
import { MatSnackBarModule} from '@angular/material';
import { CoreConfig} from './core.config';
import { CoreEvent} from './core.event';
import { CoreAuth } from './core.auth';
import { CoreBackend } from './core.backend';
import { CorePreloadingStrategy } from './core.preloading.strategy';
import { GatewayAuth } from './gateway.auth';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    imports: [
      MatSnackBarModule,
    ],
    providers: [
       CoreConfig,
       CoreEvent,
       CoreAuth,
       CoreBackend,
       CorePreloadingStrategy,
       GatewayAuth,
       CookieService
    ]
})
export class NgxDoCoreModule {}
