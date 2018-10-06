import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
}
