import { Component, OnInit } from '@angular/core';
import { CHECKBOX_HELPERS } from './helpers.data';

@Component({
  selector: 'ngx-do-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  constructor() { }

  	checked = false;
	indeterminate = false;
	align = 'start';
	disabled = false;

checkboxHelpers: any = CHECKBOX_HELPERS ;

  ngOnInit() {
  }
}
