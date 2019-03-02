import { Component, OnInit , Input,ViewChild} from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { CoreConfig,GatewayAuth } from 'ngx-do';
import { BackendService } from './backend/backend.service';
import { AppMenu } from './app.menu';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})

export class AppComponent implements OnInit {

  @Input() isVisible = true;
  aiToken: string = null;
  profileRoute = '/app/pages/profile';
  securityRoute = '/app/pages/security';
  settingsRoute = '';
  helpRoute = '';

  visibility = 'shown';

  sideNavOpened = true;
  matDrawerOpened = false;
  matDrawerShow = true;
  sideNavMode = 'side';
  @ViewChild("sidenav") sidenav;
  @ViewChild("drawer") drawer;
  public selectedMenu;

	constructor(private media: ObservableMedia,
              public coreConfig: CoreConfig,
              protected backend: BackendService) {
    this.selectedMenu=this._selectedMenu.bind(this);
    this.backend.getKeyVault('dialogflow').subscribe(rec => {
      this.aiToken = rec['value'];
    });
    this.coreConfig.menus = AppMenu; // addMenu(goMenus);
  }

	ngOnInit() {
		this.media.subscribe((mediaChange: MediaChange) => {
       this.toggleView();
    });
	}

  ngOnChanges() {
   this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  getRouteAnimation(outlet) {
   return outlet.activatedRouteData.animation;
       // return outlet.isActivated ? outlet.activatedRoute : ''
  }

 sideMenu(state){
    setTimeout(()=>{  
       switch (state){
         case "hide":
           this.drawer.close();
           this.sidenav.close();
           this.matDrawerShow=false;
           break; 
         case "full":
           this.drawer.close();
           this.sidenav.open();
           //this.matDrawerShow=false;
           break;    
         
         case "collapse": //"collapse"
           this.drawer.open();
           this.sidenav.close();
         case "none": 
         default:   
       }
     },0);
  }

	toggleView() {
		if (this.media.isActive('gt-md')) {
        this.sideNavMode = 'side';
        this.sideNavOpened = true;
        this.matDrawerOpened = false;
        this.matDrawerShow = true;
    } else if(this.media.isActive('gt-xs')) {
        this.sideNavMode = 'side';
        this.sideNavOpened = false;
        this.matDrawerOpened = true;
        this.matDrawerShow = true;
    } else if (this.media.isActive('lt-sm')) {
        this.sideNavMode = 'over';
        this.sideNavOpened = false;
        this.matDrawerOpened = false;
        this.matDrawerShow = false;
    }
	}
  
  _selectedMenu(menu){
    if (this.sideNavMode=='over') this.sidenav.close();
    if (menu.menu){this.sideMenu(menu.menu)}
  };


}
