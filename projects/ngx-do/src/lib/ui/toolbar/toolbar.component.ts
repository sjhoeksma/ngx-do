import { Component, OnInit, Input } from '@angular/core';
import { CoreConfig } from '../../core/core.config';

@Component({
  selector: 'ngx-do-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() sidenav;
	@Input() sidebar;
	@Input() drawer;
	@Input() matDrawerShow;
  @Input() searchShow = false;
  @Input() settingsRoute;
  @Input() profileRoute;
  @Input() securityRoute;
  @Input() helpRoute;
  @Input() logoutRoute =  '/logout';
  @Input() tipSearch = 'Search site';
  @Input() tipFullscreen = 'Full screen';
  @Input() tipNotifications = 'Notifications';
  @Input() tipShoppingBasket = 'Shoppingbasket';
  @Input() tipUserMenu = 'User Menu';

	searchOpen = false;
  constructor(public coreConfig: CoreConfig) {
  }

  ngOnInit() {
  }

}
