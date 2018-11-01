import {Component} from '@angular/core';
import {CoreAuth} from 'ngx-do-cdk';

@Component({
  selector: 'app-nodered',
  template: `
    <iframe [src]="url | safeUrl" width="100%" height="100%" allowfullscreen></iframe>
  `
})
export class NodeRedComponent {
  public url: string;
  constructor(private coreAuth:CoreAuth){
    this.url="http://localhost:3000/red?_token="+this.coreAuth.authToken;
  }
}