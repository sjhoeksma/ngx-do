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
  @Input() searchShow;
  @Input() aiChatbotShow;
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
   if (this.aiToken==null) this.aiToken = this.coreConfig.backendValue('aiChatbotToken');
   if (this.searchShow==null) this.searchShow = this.aiToken==null;
   if (this.aiToken && this.aiChatbotShow==null) this.aiChatbotShow = !this.searchShow;
  }

}
