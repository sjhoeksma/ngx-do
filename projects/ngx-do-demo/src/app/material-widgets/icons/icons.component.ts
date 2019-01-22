import { Component, OnInit } from '@angular/core';
import { ICON_HELPERS } from './helpers.data';

@Component({
  selector: 'ngx-do-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  constructor() { }
  iconHelpers: any = ICON_HELPERS;

  ngOnInit() {
  }

}
