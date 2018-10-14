import { Component, OnInit, Input } from '@angular/core';   
import { CoreConfig } from '../core.config';

@Component({
  selector: 'cdk-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.theme.scss']
})
export class SidemenuComponent implements OnInit {

    @Input() iconOnly:boolean = false;
    @Input() profileRoute
    @Input() currentUser;
    profileMenu : object ;
    public menus = this.coreConfig.menus;

    constructor(public coreConfig: CoreConfig ) {  
    }

    ngOnInit() {
      this.profileMenu ={
        'name': 'Profile',
        'icon': 'account_circle',
        'link': this.profileRoute,
        'open': true,
        'visible':true
      }
    }

}
