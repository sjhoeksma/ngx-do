import { Component, OnInit } from '@angular/core';
import { SLIDER_HELPERS } from './helpers.data';
@Component({
  selector: 'ngx-do-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  constructor() { }

	autoTicks = false;
	disabled = false;
	invert = false;
	max = 100;
	min = 0;
	showTicks = false;
	step = 1;
	thumbLabel = false;
	value = 0;
	vertical = false;
    tickInterval;

  sliderHelpers: any = SLIDER_HELPERS;

  ngOnInit() {
  }

}
