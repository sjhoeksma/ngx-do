import { Component, OnInit, Input } from '@angular/core';
import { CoreConfig } from '../core.config';

@Component({
  selector: 'cdk-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
	
  @Input() sidenav;
	@Input() sidebar;
	@Input() drawer;
	@Input() matDrawerShow;
  @Input() searchShow = true;
  @Input() aiChatbotShow = false;
  @Input() aiToken;
  @Input() settingsRoute;
  @Input() profileRoute;
  @Input() helpRoute;
  @Input() logoutRoute =  '/login';
  
	searchOpen: boolean = false;
  aiChatbotOpen : boolean = false;
  constructor(public coreConfig: CoreConfig) { 
  }

  ngOnInit() {
  }

}
