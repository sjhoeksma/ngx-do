import { Injectable} from '@angular/core';
import {Restangular } from 'ngx-restangular';
import * as Msal from 'msal';
import { CoreConfig,BaseAuth,CoreAuth} from 'ngx-do';

@Injectable({providedIn: 'root'})
export class MsalAuth extends BaseAuth {
  protected msal: any;

  constructor(protected coreAuth:CoreAuth){
    super();
    coreAuth.registerAuthSerice("msal",this);
  }
  
  public connect(coreConfig: CoreConfig, rest: Restangular):Promise<boolean>{
    this.workAround = coreConfig.backendValue('workAround', true);
    return super.connect(coreConfig,rest);
  }

  /**
   * There is a bug with using localStorage and redirect msal.
   * We implemented a workaround which copies sessionStorage
   * when we want to remember login status
   */
  private workAround = true; // workaround for session cookie in localstorage and reloading after login


  private copyMsal(toLocal: boolean) {
    if (!this.coreConfig.remember) { return; }
    const keys = ['msal.authority', 'msal.acquireTokenUser', 'msal.client.info', 'msal.error', 'msal.error.description', 'msal.session.state', 'msal.token.keys', 'msal.access.token.key', 'msal.expiration.key', 'msal.state.login', 'msal.state.acquireToken', 'msal.state.renew', 'msal.nonce.idtoken', 'msal.username', 'msal.idtoken', 'msal.login.request', 'msal.login.error', 'msal.token.renew.status', 'adal.idtoken'];
    if (toLocal) {
      keys.forEach(function(k) {
        const v = sessionStorage.getItem(k);
        if (v) {
          localStorage.setItem(k, v);
        } else {
          localStorage.removeItem(k);
        }
      });
    } else {
      keys.forEach(function(k) {
        const v = localStorage.getItem(k);
        if (v &&  !sessionStorage.getItem(k)) {
          sessionStorage.setItem(k, v);
        }
      });
    }
  }

  public get isReady(): Promise<boolean> {
    if (!this._isReady) {
     this._isReady = new Promise((resolve, reject) => {
        if (this.workAround) { this.copyMsal(false); }
        // Create the client
        this.msal = new Msal.UserAgentApplication(
             this.coreConfig.backendEnv['clientID'],
             this.coreConfig.backendEnv['authority'],
          (errorDesc, token, error, tokenType) => {
            if (token) {
              delete window['#id_token'];
              history.replaceState({}, document.title, '.');
              if (this.workAround) {
                location.reload(); // Work around reload of location works best
              } else {
                this._accessToken = this.coreConfig.getItem(BaseAuth.accessKey);
                resolve(this.loggedIn);
              }
            } else { resolve(this.loggedIn); }
          }, {
           cacheLocation: this. workAround ?  'sessionStorage' :
                this.coreConfig.remember ? 'localStorage' : 'sessionStorage',
           redirectUri: this.coreConfig.baseUrl,
           postLogoutRedirectUri: this.coreConfig.baseUrl,
           navigateToLoginRequestUrl: false,
           isAngular: !this.workAround,
           storeAuthStateInCookie: true
        });

        // Check for hash
       let hash = window['#id_token'] || window.location.hash;
       const i = hash.indexOf('&');
       if (window.location.hash.indexOf('#id_token') > 0) {
         // This should be handled during agent creation
       } else if (hash.indexOf('#id_token') >= 0 ) {
         hash = (i < 0) ? hash : hash.substring(0, i - 1);
         // Process the request and this will trigger the agent
         this.msal.processCallBack.call(this.msal, hash);
       } else {
            // Refresh the internal stored hash hash
           this.refreshToken().then((accessToken) => {
            this._accessToken = this.coreConfig.getItem(BaseAuth.accessKey);
            resolve(this.loggedIn);
          }, () => {resolve(this.loggedIn); });
        }
      });
    }
    return this._isReady;
  }

  public login(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
     return new Promise<boolean>((resolve, reject) => {
      if (!this.coreConfig.backendEnv['popup']) {
        this.msal.loginRedirect(this.coreConfig.backendEnv['consentScopes']);
      } else { this.msal.loginPopup(this.coreConfig.backendEnv['consentScopes'])
        .then((token) => {
        this.refreshToken().then((accesToken) => {
            resolve(this.loggedIn);
          }, () => {resolve(this.loggedIn); });
      }, (error) => {
        resolve(false);
      });
      }
    });
  }

  public logout(byUser: boolean = false): Promise<boolean>  {
    this._accessToken = null;
    this._groups = null;
    if (this.coreConfig.backendValue('fullLogout', false)) {
      super.logout(byUser); // No Routing
      this.msal.logout();
      return Promise.resolve(true);
    }
    return super.logout(byUser);
  }


  private validateToken(token: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const decoded = this.coreConfig.decodeJWT(token);
      if (!decoded) {
        this.authToken = null;
        return resolve(this._token);
      }
      const apiUrl = this.coreConfig.backendValue('apiURL');
      if (apiUrl) {
        const head: object = {
          ContentType: 'application/x-www-form-urlencoded'};
        const decoded = this.coreConfig.decodeJWT(token);
        if ( token) { head['Authorization'] = `Bearer ${token}`; }
        if ( this._accessToken) { head['ClientAuthorization'] = this._accessToken; }
        this.rest.one('auth')
           .customPOST({email: decoded['preferred_username'] || decoded['email'],
              signup: this.coreConfig.backendValue('signup', false),
              type:  this.coreConfig.backendValue('type', 'msal')}
              , '', {} , head).toPromise().then( (res) => {
           this.authToken = token;
          // Extract the groups from the proxy
           const decoded = this.coreConfig.decodeJWT(res.access_token);
           if (decoded) { this._groups = decoded['groups']; }
           if (this.workAround) { this.copyMsal(true); }
          return resolve(this._token);
        }).catch((ex) => {
          this.authToken = null;
          console.log('Failed ValidateToken', ex);
          return resolve(this._token);
        });
     } else {
       this.authToken = token;
       return resolve(this._token);
     }
    });
  }


  public refreshToken():  Promise<string> {
    const key = 'msal.idtoken';
    if (navigator.onLine) {
      return new Promise((resolve, reject) => {
        this.msal.acquireTokenSilent(this.coreConfig.backendEnv['consentScopes'])
          .then((accessToken) => {
             this._accessToken = accessToken;
             this.validateToken(!this.workAround && this.coreConfig.remember ?
                localStorage.getItem(key) || sessionStorage.getItem(key)
                : sessionStorage.getItem(key)
               ).then(resolve, reject);
          }, ex => {
            // Only show real errors, not warnings
            if (ex.toString().indexOf('AADSTS700051') >= 0) {
              console.warn('Token refresh not enabled for this application');
               // Check if the accessToken is stored in a session
              const storage = this.workAround || !this.coreConfig.remember ? sessionStorage : localStorage;
              Object.keys(storage).forEach(key => {
                if (key.indexOf('{"authority"') === 0) {
                  try {
                   this.accessToken = JSON.parse(storage.getItem(key)).accessToken;
                   storage.removeItem(key);
                  } catch (ex) {}
                }
              });
            } else if (ex.toString().indexOf('AADSTS50076') >= 0) {
              console.warn('Token refresh requires MFA');

              this.authToken = null;
              return resolve(this._token);
            } else {
               console.error('RefreshToken Failed', ex);
               this.authToken = null;
            }
            this.validateToken(!this.workAround && this.coreConfig.remember ?
                localStorage.getItem(key) ||  sessionStorage.getItem(key)
                : sessionStorage.getItem(key)
               ).then(resolve, reject);
          }).catch(function(ex) {
            console.error('RefreshToken Error', ex);
            resolve(this._token);
          });
        });
    }
    return Promise.resolve(this._token);
  }

  public userData(): Promise<object> {
    if (!this._accessToken) { return Promise.resolve({}); }
    return new Promise((resolve, reject) => {
      this.rest.oneUrl('msal_user', 'https://graph.microsoft.com/v1.0/me')
        .get(null, {Authorization: 'Bearer ' + this._accessToken })
        .subscribe(data => {resolve(data); }, error => {
        console.error('Failed to retrieve user data', error);
        resolve({});
      });
    });
  }

}
