import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject,Subscription } from 'rxjs';

import {Restangular } from 'ngx-restangular';
import { CoreEvent, CoreAuth, CoreConfig, CoreBackend } from 'ngx-do-cdk';
import * as uuidv4 from 'uuid/v4';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class BackendService extends CoreBackend {
   public static readonly assign_backend = "backend"; //Assigned to backend will be 
 
  public refreshTasks():Promise<boolean>{
    return super.refreshTasks();
  }
  
  public loadCommonData(){
    return super.loadCommonData();
  }
  
  //Catch core events, to load data
  public processEvent(event:object){
    switch (event['event']){

      default: super.processEvent(event);
    }
  }
}