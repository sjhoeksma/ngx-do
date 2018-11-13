import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreConfig } from '../core.config';
import { AuthInterface } from '../core.auth';
import {Restangular } from 'ngx-restangular';

export class BaseAuth implements AuthInterface {
  public static sessionKey = 'session_key';
	constructor(protected coreConfig: CoreConfig,protected rest: Restangular) {
    this.rest.provider.setBaseUrl(this.coreConfig.backendValue('apiURL'));
  }
  
  protected _user  : string;
  protected _token : string;
  protected _accessToken : string;
  public login(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean> {
    this._user = user;
    this._token = null;
    return Promise.resolve(this.loggedIn);
  }
  
  public userData(): Promise<object> {
    return Promise.resolve(this._token ? {'name':this._user} : {});
  }
  
  public signup(user: string = null, pass: string = null, remember: boolean = false): Promise<boolean>{
    return this.login(user,pass,remember);
  }
  
  public redirectLogin(): Promise<boolean>{
    return Promise.resolve(false); //We don't support this
  }

  public logout(byUser:boolean = false):Promise<boolean>  {
    this.authToken=null;
    this.coreConfig.clearStorage(byUser);
    return Promise.resolve(!this.loggedIn);
  }
  
  public refreshToken():  Promise<string> {
    return Promise.resolve(this._token);
  }
    
  public setDefaultHeader(){
    let head : object= {};
    if ( this._token) head['Authorization']= `Bearer ${this._token}` 
    if ( this._accessToken) head['access_token'] = this._accessToken;
     this.rest.provider.setDefaultHeaders(head);
  }
  
  get accessToken(): string {
    return this._accessToken || this._token;
  }
  
  set accessToken(token: string) {
    this._accessToken = token;
    this.setDefaultHeader();
  }
  get authToken(): string {
    return this._token;
  }
  
  set authToken(token:string){
    if (!token){
      this.coreConfig.setItem(BaseAuth.sessionKey); 
      this._token = null;
      this._user = null;
      this._accessToken=null;
      this.setDefaultHeader();
    } else {
      const decoded = this.coreConfig.decodeJWT(token);
      //Check if token is not expired
      if (decoded && (!decoded['exp'] || decoded['exp']>(new Date().getTime()/1000))){
          this._token = token;
          this.setDefaultHeader();
          this._user=decoded['preferred_username'] || decoded['name'] || 
                     decoded['email'] || this._user;
          this.coreConfig.setItem(BaseAuth.sessionKey,token);
      } else {
        this.logout();  
      }
    }
  }
                          
  get loggedIn():boolean {
    return this._token!=null;
  }
  
  protected _isReady:Promise<boolean>
  get isReady():Promise<boolean>{
    if (!this._isReady){
      this._isReady = new Promise<boolean>((resolve, reject) => {
          //We make sure the remember is loaded before we use the key
          if (this.coreConfig.getItem(BaseAuth.sessionKey,null,this.coreConfig.remember)){
            this.authToken = this.coreConfig.getItem(BaseAuth.sessionKey);
          }
          resolve(this.loggedIn); 
      });
    }
    return this._isReady;
  }
  
  public get roles():Array<string>{
    let token = this.coreConfig.decodeJWT(this._token);
    let groups = ((token) ? token['groups'] : []) ||[];  
    let groupMap = this.coreConfig.backendValue('groupMap',{});
    groups.forEach(group=>{
      if (groupMap[group]) groups.push(groupMap[group]);
    })
    return groups;
  }
  
  public hasRole(role:any): Promise<boolean>  {
    return new Promise<boolean>((resolve, reject) => { 
    let roles = this.roles;
     if (role==null){
       resolve(true);
     } else {
       if (typeof role == "string"){
         return resolve(roles.indexOf(role)>=0);
       } else if (Array.isArray(role)){
         let state=false;
         role.forEach(function(el){
            if (roles.indexOf(el)>=0) state=true;
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