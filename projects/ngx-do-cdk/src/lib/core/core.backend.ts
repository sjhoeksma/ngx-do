
import {of as observableOf,  Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import {Restangular } from 'ngx-restangular';
import { CoreEvent} from './core.event';
import { CoreAuth} from './core.auth';
import { CoreConfig } from './core.config';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class CoreBackend implements OnDestroy {
   private subscription: Subscription;
   public taskCount: number;
   public tasks: any;
   constructor(protected coreEvent: CoreEvent, protected rest: Restangular,
                protected coreAuth: CoreAuth, protected coreConfig: CoreConfig,
              protected router: Router, protected snackBar: MatSnackBar) {
      this.subscription = this.coreEvent.get(CoreEvent.core_channel).subscribe(
          event => { this.processEvent(event); });
      this.loadCommonData();
      setInterval(() => {
        this.refresh();
      }, this.coreConfig.backendValue('backendRefresh', 60) * 1000);
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    public get authId(): string {
      return this.coreConfig.currentUser['id'];
    }

    public snackMsg(message: string, action: string= '', timeout: number= 2000) {
      this.snackBar.open(message, action, {duration: timeout });

    }

    public getList(name: string, options: object= {}, loggedIn: boolean= true): Observable<any> {
      if (loggedIn && !this.coreAuth.loggedIn) { return observableOf([]); }
      return this.rest.all(name).getList(options);
    }

    public getOne(name: string, id: string, options: object= {}, loggedIn: boolean= true): Observable<any> {
      if (loggedIn && !this.coreAuth.loggedIn) { return observableOf([]); }
      return this.rest.one(name, id).get(options);
    }

    public getBase(name: string, loggedIn: boolean= true): any {
      if (loggedIn && !this.coreAuth.loggedIn) { return null; }
      return this.rest.all(name);
    }


  public getKeyVault(id: string): Observable<object> {
    return this.getOne('keyvault', id);
  }

  public refreshTasks(): Promise<boolean> {
    if (!this.coreAuth.loggedIn) {
      this.tasks = [];
      this.taskCount = this.tasks.length;
      return Promise.resolve(false);
    }
    return new Promise<boolean>((resolve, reject) => {
      // Add Your own stuff tasks Notifications
      resolve(true);
    });
  }

  public refresh() {
    this.refreshTasks();
  }


  public loadCommonData() {
    if (this.coreAuth.loggedIn) {
      // TODO:Load Secrets which should not be stored in front-end

      // Load user based on email as key
      this.getList('users', {email: this.coreAuth.authUser})
        .subscribe(data => {
            this.coreConfig.currentUser = Object.assign(
              {name: this.coreAuth.authUser},
              data[0] ? data[0].plain() : null);
            // A sign the drive data
            this.coreAuth.userData().then(udata => {
              this.coreConfig.currentUser = Object.assign(udata, this.coreConfig.currentUser);
              this.coreEvent.send({event: 'userInfo', userInfo: this.coreConfig.currentUser}, CoreEvent.core_channel);
            });
        });

      // Load the shopping cart
      this.coreConfig.shoppingBasket = this.coreConfig.getItem('cart');

      // tasks & Notifications
      this.refresh();

    }
  }

    // Catch core events, to load data
    public processEvent(event: object) {
      switch (event['event']) {
        case 'refresh': this.refresh(); break;
        case 'onUnlock':
        case 'load': this.loadCommonData(); break;
        default: if (!(this.coreConfig.environment && this.coreConfig.environment.production)) {
          console.log('Received Event', event);
                 }
      }
    }
}
