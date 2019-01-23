import { NgModule } from '@angular/core';
//import { NgxDoCoreModule} from 'ngx-do';
import { MsalAuth} from './msal.auth';


@NgModule({
    imports: [
 //     NgxDoCoreModule
    ],
    providers: [
      MsalAuth
    ]
})
export class NgxDoMsalModule {}
