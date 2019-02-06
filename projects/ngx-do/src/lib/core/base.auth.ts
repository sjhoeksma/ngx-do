import { CoreConfig } from './core.config';
import { AuthInterface } from './core.auth';
import {Restangular } from 'ngx-restangular';

export class BaseAuth implements AuthInterface {
  public static sessionKey = 'session_key';
  public static accessKey = 'access_key';
  protected rest: Restangular;
  protected coreConfig: CoreConfig;
  protected _isReady: Promise<boolean>;

  protected _user: string;
  protected _token: string;
  protected _accessToken: string;
  private _groups : Array<string> = null;
  protected _validTill;
  public login(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
    this._user = user;
    this._token = null;
    return Promise.resolve(this.loggedIn);
  }

  public connect(coreConfig: CoreConfig, rest: Restangular): Promise<boolean> {
    this.coreConfig = coreConfig;
    this.rest = rest;
    this._isReady = null;
    this.rest.provider.setBaseUrl(this.coreConfig.backendValue('apiURL'));
    return this.isReady;
  }

  public userData(): Promise<object> {
    return Promise.resolve(this._token ? {'name': this._user} : {});
  }

  public signup(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
    return this.login(user, pass, remember);
  }

  public redirectLogin(): Promise<boolean> {
    return Promise.resolve(false); // We don't support this
  }

  public logout(byUser: boolean = false): Promise<boolean>  {
    this.authToken = null;
    this.coreConfig.clearStorage(byUser);
    return Promise.resolve(!this.loggedIn);
  }

  public refreshToken():  Promise<string> {
    return Promise.resolve(this._token);
  }

  public setDefaultHeader() {
    const head: object = {};
    if ( this._token) { head['Authorization'] = `Bearer ${this._token}`; }
     this.rest.provider.setDefaultHeaders(head);
  }

  get accessToken(): string {
    return this._accessToken || this._token;
  }

  set accessToken(token: string) {
    this._accessToken = token;
    this.coreConfig.setItem(BaseAuth.accessKey, token);
  }

  get authToken(): string {
    return this._token;
  }

  set authToken(token: string) {
    this._groups=null;
    if (!token) {
      this.coreConfig.setItem(BaseAuth.sessionKey);
      this.coreConfig.setItem(BaseAuth.accessKey);
      this._token = null;
      this._user = null;
      this._accessToken = null;
      this._validTill=0;
      this.setDefaultHeader();
    } else {
      const decoded = this.coreConfig.decodeJWT(token);
      // Check if token is not expired
      this._validTill=decoded['exp'] ? decoded['exp'] * 1000 : 0;
      if (decoded && (!this._validTill || this._validTill> new Date().getTime())) {
          this._user = decoded['preferred_username'] || decoded['name'] ||
                     decoded['email'] || this._user;
          this.coreConfig.setItem(BaseAuth.sessionKey, token);
          this._token = token;
          this.setDefaultHeader();
      } else {
        this.logout();
      }
    }
  }

  get loggedIn(): boolean {
    if (this._token && this._validTill && this._validTill<=new Date().getTime()) 
      this.logout();
    return this._token != null;
  }

  get isReady(): Promise<boolean> {
    if (!this._isReady) {
      this._isReady = new Promise<boolean>((resolve, reject) => {
          // We make sure the remember is loaded before we use the key
          if (this.coreConfig.getItem(BaseAuth.sessionKey, null, this.coreConfig.remember)) {
            this.authToken = this.coreConfig.getItem(BaseAuth.sessionKey);
            this.accessToken = this.coreConfig.getItem(BaseAuth.accessKey);
          }
          resolve(this.loggedIn);
      });
    }
    return this._isReady;
  }

  public get roles(): Array<string> {
    if (!this._groups){
      const token = this.coreConfig.decodeJWT(this._token);
      const groups = ((token) ? token['groups'] : ['default']) || ['default'];
      const groupMap = this.coreConfig.backendValue('groupMap', {});
      Object.keys(groupMap).forEach(group => {
        if (groups.index(group)>=0) {
          groups.push(groupMap[group]); 
        }
      });
      this._groups=groups;
    }
    return this._groups;
  }

  public hasRole(role: any): Promise<boolean>  {
    return new Promise<boolean>((resolve, reject) => {
    const find = function(a, inb) {
      const reg = new RegExp('\\b' + a + '\\b', 'i');
      return reg.test(inb);
    };
    const roles = this.roles || [];
     if (role === null || typeof role === 'undefined') {
       resolve(true);
     } else {
       if (typeof role === 'string') {
         return resolve(find(role, roles));
       } else if (Array.isArray(role)) {
         let state = false;
         role.forEach(function(el) {
            if (find(el, roles)) { state = true; }
          });
         return resolve(state);
       }
       return resolve(false);
     }
    });
  }

  get authUser(): string {
    return this._user;
  }
}
