import 'hammerjs';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { MainModule } from './main.module';

//If we are production enable prodmode
if (environment.production) {
  enableProdMode();
}
 
//Bootstrap the Main Module and provide the Environment to the Do components
platformBrowserDynamic([{ provide: 'Environment', useValue: environment }])
  .bootstrapModule(MainModule)
  .catch(err => console.log(err));
