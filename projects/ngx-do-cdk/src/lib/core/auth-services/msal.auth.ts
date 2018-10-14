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
     this._isReady=new Promise((resolve,reject)=>{
        //Create the client
        this.msal = new Msal.UserAgentApplication(
             this.coreConfig.backendEnv['clientID'], 
             this.coreConfig.backendEnv['authority'], 
          (errorDesc, token, error, tokenType) => {
            this.validateToken(token).then(
            token=>{resolve(this.loggedIn)});
          },{
           cacheLocation: this.coreConfig.remember ? 'localStorage' : 'sessionStorage',
           redirectUri: this.coreConfig.baseUrl,
           postLogoutRedirectUri: this.coreConfig.baseUrl,
           navigateToLoginRequestUrl:false
        }); 

        //Check for hash
        let hash = window.location.hash;
        if (hash && hash.indexOf('#id_token=')==0) {
          this.msal.saveTokenFromHash(this.msal.getRequestInfo(hash));
          this.validateToken(hash.substring(10)).then(
            token=>{resolve(this.loggedIn)});
          history.replaceState({}, document.title, "."); //Remove hash from url
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
        this.validateToken(token).then(
            token=>{resolve(this.loggedIn)});
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
  
  private validateToken(token:string): Promise<string>{
    return new Promise<string>((resolve,reject)=>{ 
      const decoded = this.coreConfig.decodeJWT(token);
      if (!decoded) {
        this.authToken=null;
        return resolve(this._token);
      } 
      const apiUrl = this.coreConfig.backendEnv['apiURL'];
      if (apiUrl){
        let head : object= {
          ContentType:'application/x-www-form-urlencoded'};
        const decoded = this.coreConfig.decodeJWT(token);
        if ( token) head['Authorization']= `Bearer ${token}` 
        if ( this._accessToken) head['access_token'] = this._accessToken;
        this.rest.one('auth')
           .customPOST({email:decoded['preferred_username'] || decoded['email'],
              signup: this.coreConfig.backendValue('signup',false),
              type:  this.coreConfig.backendValue('type','msal')}
              ,'',{} , head).toPromise().then( (obj) => {          
           this.authToken = token;
          return resolve(this._token);
        }).catch((ex) => {
          this.authToken = null;
          console.log("Failed ValidateToken",ex);
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
      return new Promise((resolve,reject)=>{
        this.msal.acquireTokenSilent(this.coreConfig.backendEnv['consentScopes'])
          .then((accessToken)=>{  
             const apiUrl = this.coreConfig.backendEnv['apiURL'];
             this._accessToken=accessToken;
             this.validateToken(this.coreConfig.remember ?  
                localStorage.getItem(key)||  sessionStorage.getItem(key) 
                : sessionStorage.getItem(key)
               ).then(resolve,reject);
          },(ex)=>{
            //Only show real errors, not warnings
            if (ex.toString().indexOf('AADSTS700051')>=0)
             console.warn('Token refresh not enabled for this application');
            else  
               console.error("RefreshToken Failed",ex);
            this.validateToken(this.coreConfig.remember ?  
                localStorage.getItem(key)||  sessionStorage.getItem(key) 
                : sessionStorage.getItem(key)
               ).then(resolve,reject);
          }).catch(function(ex) {
            console.error("RefreshToken Error",ex)
            resolve(this._token);
          });
        });
    }
    return Promise.resolve(this._token);
  }
  
}