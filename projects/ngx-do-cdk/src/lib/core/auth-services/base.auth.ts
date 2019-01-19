import { CoreConfig } from '../core.config';
import { AuthInterface } from '../core.auth';
import {Restangular } from 'ngx-restangular';

export class BaseAuth implements AuthInterface {
  public static sessionKey = 'session_key';
  public static accessKey = 'access_key';
  protected _isReady: Promise<boolean>;
	constructor(protected coreConfig: CoreConfig, protected rest: Restangular) {
    this._isReady = null;
    this.rest.provider.setBaseUrl(this.coreConfig.backendValue('apiURL'));
  }

  protected _user: string;
  protected _token: string;
  protected _accessToken: string;
  protected _groups: Array<string>;
  public login(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
    this._user = user;
    this._token = null;
    return Promise.resolve(this.loggedIn);
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
    if (!token) {
      this.coreConfig.setItem(BaseAuth.sessionKey);
      this.coreConfig.setItem(BaseAuth.accessKey);
      this._token = null;
      this._user = null;
      this._accessToken = null;
      this._groups = null;
      this.setDefaultHeader();
    } else {
      const decoded = this.coreConfig.decodeJWT(token);
      // Check if token is not expired
      if (decoded && (!decoded['exp'] || decoded['exp'] > (new Date().getTime() / 1000))) {
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
    const token = this.coreConfig.decodeJWT(this._token);
    const groups = ((token) ? token['groups'] : ['default']) || ['default'];
    if (this._groups) { groups.concat(this._groups); }
    const groupMap = this.coreConfig.backendValue('groupMap', {});
    groups.forEach(group => {
      if (groupMap[group]) { groups.push(groupMap[group]); }
    });
    return groups;
  }

  public hasRole(role: any): Promise<boolean>  {
    return new Promise<boolean>((resolve, reject) => {
    const find = function(a, inb) {
      const reg = new RegExp('\\b' + a + '\\b', 'i');
      return reg.test(inb);
    };
    const roles = this.roles || [];
     if (role === null) {
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
