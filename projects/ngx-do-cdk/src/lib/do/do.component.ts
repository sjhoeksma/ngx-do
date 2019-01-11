import { Component,HostListener, OnInit,Inject } from '@angular/core';

import { CoreAuth } from '../core/core.auth';
import { CoreConfig } from '../core/core.config';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
} from '@angular/animations'
@Component({
  selector: 'app-do',
  templateUrl: './do.component.html',
  styleUrls: ['./do.component.scss'],

})
export class DoComponent implements OnInit {
  locked = false;
  idleTimer;

  
 constructor(protected coreAuth: CoreAuth,public coreConfig: CoreConfig, @Inject("Environment") private env:any){
   console.log((this.env.title||this.env.name) +" v"+this.env.version);
   let title = this.env.title;
   if (title) {
     if (this.coreConfig.DEMO) title=title+ ' ' + 'DEMO';
     document.title=title ;
   }
 }  
   
  
 ngOnInit() {
    this.onWakeup(null); //Trigger the timer
 }
  
 //Add listeners to focus and blur of main window to handle authentication refreshes  
 @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    if (this.locked) this.coreAuth.onUnlock();
    this.onWakeup(event);
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    this.locked =true;
  }
  
  //IdleLockout will show lock srceen based on backend setting idleLockout
  @HostListener('window:scroll', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  @HostListener('window:mousedown', ['$event'])
  @HostListener('window:mousewheel', ['$event'])
  @HostListener('window:DOMMouseScroll', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  @HostListener('window:click', ['$event'])
  @HostListener('window:keyup', ['$event'])
  @HostListener('window:keydown', ['$event'])
  onWakeup(event:any):void {
    clearTimeout(this.idleTimer);
    if (this.locked) this.locked = false;
    this.idleTimer = setTimeout(()=>{ 
       this.locked=true;
       this.coreAuth.onLock();
     },this.coreConfig.backendValue('lockIdle',3)*60000);
  }
  
  
  getRouteAnimation(outlet) {
      return outlet.activatedRouteData.animation
  }
}
