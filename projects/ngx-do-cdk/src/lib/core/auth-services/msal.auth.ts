import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { CoreConfig } from '../core.config';
import {Restangular } from 'ngx-restangular';
import * as Msal  from 'msal';
import { BaseAuth} from './base.auth';

@Injectable({
  providedIn: 'root',
})
export class MsalAuth extends BaseAuth {
  protected msal : any;
	
  public get isReady():Promise<boolean>{
    if (!this._isReady){
     this._isReady =new Promise((resolve,reject)=>{
        //Create the client
        this.msal = new Msal.UserAgentApplication(
             this.coreConfig.backendEnv['clientID'], 
             this.coreConfig.backendEnv['authority'], 
          (errorDesc, token, error, tokenType) => {
              if (token) this.authToken = token ; //Restore the token from login
              resolve(this.loggedIn);
          },{
           cacheLocation: this.coreConfig.remember ? 'localStorage' : 'sessionStorage',
           redirectUri: this.coreConfig.baseUrl,
           postLogoutRedirectUri: this.coreConfig.baseUrl,
           navigateToLoginRequestUrl:false
        }); 

        //Check for hash
        let hash = window.location.hash;
        if (hash && hash.indexOf('#id_token=')==0) {
          this.msal.saveTokenFromHash(this.msal.getRequestInfo(hash))
          this.authToken=hash.substring(10);
          history.replaceState({}, document.title, "."); //Remove hash from url
          resolve(this.loggedIn);
        } else {
            //Refresh the hash
           this.refreshToken().then((accesToken)=>{
            resolve(this.loggedIn);
          },()=>{resolve(this.loggedIn)}); 
        }
      });
    }
    return this._isReady;
  }
  
  public login(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
     return new Promise<boolean>((resolve,reject)=>{ 
      if (!this.coreConfig.backendEnv['popup']){
       this.msal.loginRedirect(this.coreConfig.backendEnv['consentScopes']);
      } else this.msal.loginPopup(this.coreConfig.backendEnv['consentScopes'])
        .then((token)=>{
        this.authToken=token;
        resolve(this._token!=null);
      },(error)=>{
        resolve(false);
      })    
    })
  }
  
  public logout(byUser:boolean = false):Promise<boolean>  {
    this._accessToken=null;
    if (this.coreConfig.backendEnv['fullLogout']==true){
      super.logout(byUser); //No Routing
      this.msal.logout();
      return Promise.resolve(true)
    }
    return super.logout(byUser);
  }
  
  public refreshToken():  Promise<string> {
    if (navigator.onLine) {
      return new Promise((resolve,reject)=>{
        this.msal.acquireTokenSilent(this.coreConfig.backendEnv['consentScopes'])
          .then((accessToken)=>{
             if (accessToken) {                 
               if (this.accessToken!=accessToken){
                 const key = 'msal.idtoken';
                 this._accessToken=accessToken;
                 let v = this.coreConfig.remember ? localStorage.getItem(key)||  sessionStorage.getItem(key) 
                      : sessionStorage.getItem(key) || localStorage.getItem(key);
                 this.authToken = v;
               } else {
               //  console.warn('Msal.auth: No change in access_token');
               }
             }
             resolve(this._token);
          },reject);
      });
    }
    return Promise.resolve(this._token);
  }
  
}