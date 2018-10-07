import { Component, OnInit ,Input} from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { CoreConfig } from 'ngx-do-cdk';
import { BackendService } from './backend/backend.service';


@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})

export class AppComponent implements OnInit{

  @Input() isVisible : boolean = true;
  aiToken : string = null;
  profileRoute = "/app/pages/profile";
  
  visibility = 'shown';

  sideNavOpened: boolean = true;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;
  sideNavMode: string = 'side';

	constructor(private media: ObservableMedia, 
              public coreConfig: CoreConfig,
              protected backend: BackendService) { 
    let $this=this;
    this.backend.getKeyVault('dialogflow').subscribe(rec=>{
      this.aiToken=rec['key'];
    });
    this.coreConfig.menus=[
      {
          'name': 'Dashboard',
          'icon': 'dashboard',
          'link': 'dashboard',
          'open': true,
      }
    ]; //addMenu(goMenus);
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
       //return outlet.isActivated ? outlet.activatedRoute : ''
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

}
