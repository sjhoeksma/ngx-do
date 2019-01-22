import { NgModule } from '@angular/core';
import { CoreModule} from 'ngx-do';
import { MsalAuth} from './msal.auth';


@NgModule({
    imports: [
      CoreModule
    ],
    providers: [
      MsalAuth
    ]
})
export class MsalModule {}
