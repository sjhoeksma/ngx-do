import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DATEPICKER_HELPERS } from './helpers.data';

@Component({
  selector: 'ngx-do-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

  constructor() { }

	startDate = new Date(1990, 0, 1);
	date = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	minDate = new Date(2000, 0, 1);
	maxDate = new Date(2020, 0, 1);
	events: string[] = [];

 datepickerHelpers: any = DATEPICKER_HELPERS;
	myFilter = (d: Date): boolean => {
		const day = d.getDay();

		return day !== 0 && day !== 6;
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
	}

  ngOnInit() {
  }
}
