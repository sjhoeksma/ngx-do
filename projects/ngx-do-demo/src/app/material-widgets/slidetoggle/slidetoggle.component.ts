import { Component, OnInit } from '@angular/core';
import { SLIDETOGGLE_HELPERS } from './helpers.data';

@Component({
  selector: 'ngx-do-slidetoggle',
  templateUrl: './slidetoggle.component.html',
  styleUrls: ['./slidetoggle.component.scss']
})
export class SlidetoggleComponent implements OnInit {

  constructor() { }

	color = 'accent';
	checked = false;
	disabled = false;

  slidetoggleHelpers: any = SLIDETOGGLE_HELPERS;

  ngOnInit() {
  }
}
