import {Component,Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CoreConfig} from '../core.config';
import {CoreAuth} from '../core.auth';
import {CoreEvent} from '../core.event';

@Component({
  selector: 'cdk-iframe',
  template: `
    <iframe [src]="url | safeUrl" width="100%" height="100%" allowfullscreen></iframe>
  `
})
export class IFrameComponent {
  @Input() url;
  @Input() key;
  @Input() token;
  @Input() unique = null;
  constructor(private coreAuth:CoreAuth,private coreConfig:CoreConfig,
              private route: ActivatedRoute,
              private coreEvent:CoreEvent){
  }
  
  ngOnInit() {
    let data = this.route.snapshot.data || {};
    if (!this.key && data.key) this.key=data.key;
    if (!this.token && data.token) this.token=data.token;
    if (!this.url && data.url) this.url=data.url;
    if (!this.unique!=null && data.unique!=null) this.unique=data.unique;
    if (this.key){
      if (Array.isArray(this.key)){
        let url;
        this.key.forEach(function(key){
          if (!url) url=this.coreConfig.backendValue(key);
        }.bind(this));
        this.url=url||this.url;
      } else {
        this.url=this.coreConfig.backendValue(this.key,this.url);
      }
    }
    let str: string='';
    if (this.token==true){
      str += "_!token="+this.coreAuth.authToken;
    } else if (this.token){
       str += this.token + "="+this.coreAuth.authToken;
    }
    if (this.unique==true){
      if (str!='') str+='&';
      str+= 'u=' + Date.now();
    }
    if (str!='') this.url += '?' + str;
    this.coreEvent.send({event:'iframe',url:this.url,data:data});
  }
}