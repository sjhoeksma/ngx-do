import * as CryptoJS from 'crypto-js';
import { BaseAuth} from './base.auth';


export class DoProxyAuth extends BaseAuth {

  public login(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // We will load user info
      const pwd = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);
      this.rest
       .one('auth').customPOST({email: user,
            password: pwd,
            type:  this.coreConfig.backendValue('type', 'do-proxy')}, '', {} ,
            {ContentType: 'application/x-www-form-urlencoded'})
       .toPromise().then((obj) => {
          const data = obj.plain();
          this._user = user;
          this.authToken = data.access_token;
          resolve(this._token != null);
        }).catch((ex) => {
          resolve(false);
        });
    });
  }

  public signup(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // We will load user info
      const pwd = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);
      this.rest
       .one('auth').customPOST({email: user,
            password: pwd,
            signup: true,
            type:  this.coreConfig.backendValue('type', 'do-proxy')}, '', {} ,
            {ContentType: 'application/x-www-form-urlencoded'})
       .toPromise().then((obj) => {
          const data = obj.plain();
          this._user = user;
          this.authToken = data.access_token;
          resolve(this._token != null);
        }).catch((ex) => {
          resolve(false);
        });
    });
  }

  public refreshToken():  Promise<string> {
    if (navigator.onLine) {
      // let $this: any = this;
      return new Promise<string>((resolve, reject) => {
       this.rest
         .one('auth').customPOST({email: this._user,
                  type:  this.coreConfig.backendValue('type', 'do-proxy')}, '', {} ,
                  {ContentType: 'application/x-www-form-urlencoded'})
         .toPromise().then( (obj) => {
            const data = obj.plain();
            this.authToken = data.access_token;
            resolve(this._token);
          }).catch((ex) => {
            console.log('Failed', ex);
            resolve(null);
          });
      });
    }
    return Promise.resolve(this._token);
  }

}
