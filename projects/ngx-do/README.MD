# NGX-DO
An application library containing the **DO** framework

## Using the ui components
To DoComponent is the engine of the application. Just embed the ```<ngx-do></ngx-do>``` tag in you **index.html** of you app

and your **main.ts **should look like below
```ts
import 'hammerjs';
import { NgModule } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

// If we are production enable prodmode
if (environment.production) {
  enableProdMode();
}

// Bootstrap the Main Module and provide the Environment to the Do components
platformBrowserDynamic([{ provide: 'Environment', useValue: environment }])
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
```

You **app.module.ts** should look like something like this

```ts
import { NgModule } from '@angular/core';
import { CoreModule,
        DoModule,
        UiModule,
        DoComponent,
       } from 'ngx-do';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        ....
        DoModule,
        UiModule,
        CoreModule,
    ],
    declarations: [AppComponent],
   bootstrap: [
    DoComponent
   ]
})
export class AppModule { }
```


