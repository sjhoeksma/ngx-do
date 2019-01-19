import { Component, OnInit } from '@angular/core';
import { MENU_HELPERS } from './helpers.data';

@Component({
  selector: 'cdk-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  menuHelpers: any = MENU_HELPERS;

  ngOnInit() {
  }

}
