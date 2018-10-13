import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
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
