import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cdk-sidemenu-item',
    templateUrl: './sidemenu-item.component.html',
    styleUrls: ['./sidemenu-item.component.scss']
})
export class SidemenuItemComponent implements OnInit {

    @Input() menu;
    @Input() iconOnly: boolean;
    @Input() secondaryMenu = false;

    constructor() { }

    ngOnInit() {
    }

    openLink() {
        this.menu.open = this.menu.open;
    }

    chechForChildMenu() {
        return (this.menu && this.menu.sub) ? true : false;
    }
  
   public isVisible(){
     if (!this.menu) return false;
     if (typeof(this.menu.visible)=='function') return this.menu.visible();
     return this.menu.visible!=false;
   }
  
   public chipValue(){
     if (!this.menu) return 0;
     if (this.menu.chip && typeof(this.menu.chip.value)=='function') 
       return this.menu.chip.value();
     return this.menu.chip.value || 0;
   }

}
