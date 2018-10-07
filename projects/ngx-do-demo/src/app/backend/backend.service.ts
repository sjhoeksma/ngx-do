import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject,Subscription } from 'rxjs';
import 'rxjs/add/observable/of';
import {Restangular } from 'ngx-restangular';
import { CoreEvent,CoreAuth,CoreConfig } from 'ngx-do-cdk';
import * as uuidv4 from 'uuid/v4';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class BackendService implements OnDestroy {
   public static readonly assign_backend = "backend"; //Assigned to backend will be picked-up by engine
   private subscription : Subscription;
   public taskCount : number;
   public tasks: any;
   constructor(private coreEvent: CoreEvent,protected rest: Restangular,
                protected coreAuth:CoreAuth,protected coreConfig:CoreConfig,
              protected router:Router,public snackBar: MatSnackBar) {
      this.subscription = this.coreEvent.get(CoreEvent.core_channel).subscribe(
          event => { this.processEvent(event)});
      this.loadCommonData();
    }
 
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }
  
    public snackMsg(message:string,action:string='',timeout:number=2000){
      this.snackBar.open(message, action, {duration: timeout });
      
    }
  
    public getList(name:string,options:object={},   loggedIn:boolean=true):Observable<any>{
      if (loggedIn && !this.coreAuth.loggedIn) return Observable.of([]);
      return this.rest.all(name).getList(options);
    }
  
    public getOne(name:string,id:string,options:object={}, loggedIn:boolean=true):Observable<any>{
      if (loggedIn && !this.coreAuth.loggedIn) return Observable.of([]);
      return this.rest.one(name,id).get(options);
    }
  
  
  public getKeyVault(id: string):Observable<object>{
    return this.getOne('keyvault',id);
  }
  
  public refreshTasks():Promise<boolean>{
    if (!this.coreAuth.loggedIn) {
      this.tasks=[];
      this.taskCount=this.tasks.length;
      return Promise.resolve(false);
    }
    return new Promise<boolean>((resolve,reject)=>{
      //Add Your own stuff tasks Notifications
      resolve(true);
    })
  }
  
  
  public loadCommonData(){
    if (this.coreAuth.loggedIn){
      //TODO:Load Secrets which should not be stored in front-end


      //Check if user is based on MSAL, and if profile contains consentScopes: ['user.read']

      //Load user based on email as key
      this.getList('users',{email:this.coreAuth.authUser})
        .subscribe(data => {
          this.coreConfig.currentUser = Object.assign({name:this.coreAuth.authUser},data[0].plain());
        });

      //Load the shopping cart
      this.coreConfig.shoppingBasket=this.coreConfig.getItem('cart');

      //tasks & Notifications
      this.refreshTasks();

    }
  }
  
    //Catch core events, to load data
    public processEvent(event:object){
      switch (event['event']){
        case "onUnlock":
        case "load": this.loadCommonData();break;
        default: console.log("Received Event",event);
      }
    }
}