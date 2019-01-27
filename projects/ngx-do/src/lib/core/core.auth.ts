import { Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, ActivatedRoute, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs';
import { CoreConfig } from './core.config';
import { CoreEvent } from './core.event';
import { BaseAuth } from './base.auth';

//TODO: Add Register function to create clear


export interface AuthInterface {
  connect(coreConfig: CoreConfig, rest: Restangular):Promise<boolean>; //Connect/Create the service
  roles: Array<string>; // The roles set in the JWT token and mapped based on <env>groupMap
  authToken: string; // JWT access token
  accessToken: string; // Encrypted access token
  loggedIn:  boolean; // Is user logged in
  authUser: string; // The name of the authenticated user
  isReady: Promise<boolean>; // Make sure the class is ready to be used
  login(user: string, pass: string, remember: boolean): Promise<boolean> ; // Login
  signup(user: string, pass: string, remember: boolean):  Promise<boolean>; // Create account
  logout(byUser: boolean): Promise<boolean>; // Logout
  refreshToken(): Promise<string>; // Refresh the token
  hasRole(role: any): Promise<boolean>; // Check if the user has roles
  userData(): Promise<object>; // return the additional user data
}

@Injectable({providedIn: 'root'})
export class CoreAuth implements CanActivate , AuthInterface {

  private services : object = {};
  constructor(protected coreConfig: CoreConfig, protected router: Router,
                private activatedRoute: ActivatedRoute,
               protected rest: Restangular, protected coreEvent: CoreEvent) {
    /*
    this.authService.isReady.then((ready)=>{ // Init the authService selected by default
      // Set the error handler for 403
      this.rest.provider.addErrorInterceptor((response, subject, responseHandler) => {
        if (this.loggedIn && response.status === 403) {
          this.refreshToken().then(token => {
            return response.repeatRequest(response.request);
          });
          return false; // error handled
        }
        return true; // error not handled
      });
    });
    */
  }
  
  public connect(coreConfig: CoreConfig, rest: Restangular):Promise<boolean>{
    return this.authService.isReady;
  }
  
  public registerAuthService(name:string,service:AuthInterface){
    console.log("Registered AuthService",name);
    this.services[name]=service;
  }
  
  public authServiceEnabled(name:string):boolean {return name ?  this.services[name] : false;}

  public get authService(): AuthInterface { // Create authentication service on the fly
    if (!this._authService || this._authBackend !== this.coreConfig.backend) {
      this._authBackend = this.coreConfig.backend;
      this._authService = this.services[this.coreConfig.backendValue('type')];
      if (!this._authService) {
        console.error('You still need to create an AuthService for',
                       this.coreConfig.backendEnv['type']);
         this._authService = new BaseAuth();
      }
      this.isReady = this._authService.connect(this.coreConfig,this.rest);

      // Wait till the new _authService is ready to see if user info should be loaded
      this.isReady.then(loggedIn => {
        if (loggedIn) {
          this.coreConfig.load(); // Load the config data
          this.refresh(true); // Start refresh
          this.activatedRoute.queryParams.subscribe(params => {
             this.router.navigate([params['requestedUrl'] || '/app']);
          });
        }
        this.coreEvent.send({event: 'isReady', loggedIn: loggedIn}, CoreEvent.core_channel);
      });

    }
    return this._authService;
  }

  get authToken(): string {
    return this.authService ? this._authService.authToken : null;
  }

  get roles(): Array<string> {
    return this.authService ? this._authService.roles : [];
  }

  set authToken(token: string) {
    if (this.authService) {
         this._authService.authToken = token;
    }
  }

  get accessToken(): string {
    return this.authService ? this._authService.accessToken : null;
  }

  set accessToken(token: string) {
    if (this.authService) {
         this._authService.accessToken = token;
    }
  }

  get loggedIn():  boolean {
    return this.authService ? this._authService.loggedIn : false;
  }

  get authUser(): string {
    return this.authService ? this._authService.authUser : null;
  }

  /* Implementation of the AuthInterface implementing redirect to real implementation */
  private _authService: AuthInterface;
  private _authBackend: String;
  private _refreshID;
  public isReady: Promise<boolean>;

  // On lock is called when none active timeout is reached
  private _lockLogout;

  /* Refresh timer forcing background refresh of token */
  public refresh(now: boolean= true) {
     if (!now && this._refreshID) { return; } // We are still running skip this request to restart
     if (this._refreshID != null) {
       clearTimeout(this._refreshID);
       this._refreshID = null;
     }
     this._refreshID = setTimeout(() => {
       this.refresh(true);
     }, this.coreConfig.backendValue('tokenRefresh', 45) * 60000); // Refresh default every 45 minutes
     if (now) { this.refreshToken(); }
  }
  public onLock() {
    if (this.loggedIn && !this._lockLogout && this.coreConfig.backendValue('lockLogout')) {
      // We have enabled lockLogout
      this._lockLogout = setTimeout(() => {
         this.logout();
      }, (this.coreConfig.backendValue('lockLogout') - this.coreConfig.backendValue('lockIdle', 3)) * 60000);
    }
    this.coreEvent.send('onLock', CoreEvent.core_channel);
  }

  // On unlock we will check if we need to login or logout or load session data
  public onUnlock() {
    clearTimeout(this._lockLogout);
    this._lockLogout = null;
    if (this.loggedIn && this.coreConfig.getItem(BaseAuth.sessionKey) == null) {
      this.logout();
    } else if (!this.loggedIn && this.coreConfig.getItem(BaseAuth.sessionKey) != null) {
      this.authToken = this.coreConfig.getItem(BaseAuth.sessionKey);
      if (this.loggedIn) {
        this.coreConfig.load().then((loadState) => {
          this.router.navigate(['/app']);
        });
      }
    }
    this.coreEvent.send('onUnlock', CoreEvent.core_channel);
  }

  public login(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean>  {
    if ( this.coreConfig.remember !== remember) { this._authService = null; } // Re-install the service
    this.coreConfig.remember = remember;
    if (this.loggedIn) { return Promise.resolve(true); } // If we are already logged exit
    return new Promise<boolean>((resolve, reject) => {
      (this.authService ? this._authService.login(user, pass, remember) : Promise.resolve(false))
        .then((loginState) => {
        this.coreEvent.send({event: 'login', loginState: loginState}, CoreEvent.core_channel);
        if (loginState) {
          this.refresh(false); // Enable refreshing of token
          this.coreConfig.load().then((loadState) => {resolve(loginState); });
        } else { resolve(loginState); }
      });
    });
  }

  public signup(user: string, pass: string, remember: boolean = false):  Promise<boolean>  {
    if ( this.coreConfig.remember !== remember) { this._authService = null; } // Re-install the service
    this.coreConfig.remember = remember;
    return new Promise<boolean>((resolve, reject) => {
      this.logout().then((logoutState) => {
        (this.authService ? this._authService.signup(user, pass, remember) : Promise.resolve(false))
          .then((signupState) => {
           this.coreEvent.send({event: 'signup', signupState: signupState}, CoreEvent.core_channel);
           if (signupState) {
             this.refresh(false); // Enable refreshing of token
             this.coreConfig.load().then((loadState) => {resolve(signupState); });
           } else { resolve(signupState); }
        });
      });
    });
  }

  public logout(byUser: boolean = false): Promise<boolean>  {
    return this.loggedIn ? new Promise<boolean>((resolve, reject) => {
      (this.authService ? this._authService.logout(byUser) : Promise.resolve(true))
      .then((logoutState) => {
        this.coreEvent.send({event: 'logout', logoutState: logoutState},
                     CoreEvent.core_channel);
        this.coreConfig.clear();
        clearTimeout(this._refreshID);
        this._refreshID = null;
        clearTimeout(this._lockLogout);
        this._lockLogout = null;
        if (!byUser) { this.router.navigate(['/login']); } // Forced logout redirect to login
        resolve(logoutState);
      });
    }) : Promise.resolve(true);
  }

  public refreshToken(): Promise<string> {
    return this.loggedIn ? new Promise<string>((resolve, reject) => {
      (this.authService ? this._authService.refreshToken() : Promise.resolve(null))
      .then((token) => {
        this.coreEvent.send({event: 'refreshToken', token: token},
                    CoreEvent.core_channel);
        if (!token) { this.logout(); } // Forced logout when token is not refreshed
        resolve(token);
      });
    }) : Promise.resolve(null);
  }

  public userData(): Promise<object> {
     return this.authService ? this._authService.userData() : Promise.resolve({});
  }

  public hasRole(role: any): Promise<boolean> {
    return this.authService ? this._authService.hasRole(role) : Promise.resolve(false);
  }

  /* Implementation of route control canActive */
  // Routing interface to check if we are allowed to use route
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
    // Check if signup is allowed by type
    if (next.routeConfig.path === 'signup') {
      return this.coreConfig.signupAllowed;
    }

    if (this.coreConfig.backendValue('authentication') && this.authService) {
      return new Promise((resolve, reject) => {
        this.isReady.then(loggedIn => {
          if (!this.loggedIn) {
            this.router.navigate(['/login'], {
              queryParams: {
                requestedUrl: state.url
              }
            });
            return resolve(false);
          }
          if (next.data && next.data.expectedRole) {
            this.hasRole(next.data.expectedRole).then((hasRole) => {
               resolve(hasRole);
           });
          } else { resolve(true); }
        });
      });
    }
    // We have a valid authentication token and no additional roles required
		return true;
	}

}
