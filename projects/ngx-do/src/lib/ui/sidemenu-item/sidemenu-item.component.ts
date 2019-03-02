import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreAuth} from '../../core/core.auth';

@Component({
    selector: 'ngx-do-sidemenu-item',
    templateUrl: './sidemenu-item.component.html',
    styleUrls: ['./sidemenu-item.component.theme.scss']
})
export class SidemenuItemComponent implements OnInit {

    @Input() menu;
    @Input() iconOnly: boolean;
    @Input() secondaryMenu = false;
    @Input() selectedMenu;
    visibleRole = true;
    visibleMenu = false;

    constructor(private coreAuth: CoreAuth, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
      let role = this.menu ? this.menu.expectedRole : null;
      // Check if the role is protected by path
      if ((role === null || typeof role === 'undefined') && this.menu && this.menu.link) {
        const routerRole = function(routes, link) {
          const links = link.split('/').splice(0, 1);
          routes.forEach(function(route) {
            if (route['path'] === links[0] || route['path'] === '/' + links[0] ) {
              if (route['data'] && route['data']['expectedRole']) {
                role = route['data']['expectedRole'];
              }
            }
            const childLink = links.splice(0, 1); // Remove the parent
            if (route['children']) {
              routerRole(route['children'], childLink.join('/'));
            }
          });
        };
        routerRole(this.router.config, this.menu.link);
      }
      this.coreAuth.hasRole(role).then(state => {
        this.visibleRole = state;
      });
    }

    clickLink(menu, event) {
      if (!(menu.link === false)) {
        if (menu.link instanceof Function) {
          menu.link();
        } else if (menu.link.indexOf('/') === 0) {
          this.router.navigate([menu.link]);
        } else {
          this.router.navigate([menu.link], {relativeTo: this.route});
        }
        if (this.selectedMenu instanceof Function) {
          this.selectedMenu(menu);
        }
      } else {
         menu.open = !menu.open;
      }
    }

   clickMenu(menu, event) {
     if (menu.sub) { menu.open = !menu.open; }
     event.stopPropagation(); // Only drop down or close
     return false;
   }

    checkForChildMenu() {
        return (this.menu && this.menu.sub) ? true : false;
    }


   public isVisible() {
     let ret = true;
     if (!this.menu) { ret = false; } else if (typeof(this.menu.visible) === 'function') { ret = this.visibleRole && this.menu.visible() ; } else {ret = this.visibleRole && (this.menu.visible !== false); }
     if (ret !== this.visibleMenu) { this.visibleMenu = ret; }
     return this.visibleMenu;
   }

   public chipValue() {
     if (!this.menu) { return 0; }
     if (this.menu.chip && typeof(this.menu.chip.value) === 'function') {
       return this.menu.chip.value();
     }
     return this.menu.chip.value || 0;
   }

}
