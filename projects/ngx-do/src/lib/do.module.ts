import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoComponent } from './do.component';


@NgModule({
  declarations: [
    DoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class DoModule {

  constructor() {
    const hash = window.location.hash;
    if (hash && hash.indexOf('#id_token=') === 0) {
      window['#id_token'] = hash;
    }
  }
}
