import { Component, OnInit } from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
  selector: 'ngx-do-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})

export class FullscreenComponent implements OnInit {
	public isFullscreen = false;
  	constructor() {
    }

  	ngOnInit() {
  	}

  public toggleFullscreen() {
	    if (screenfull.enabled) {
        if (this.isFullscreen) { screenfull.exit(); } else { screenfull.request(); }
	     	this.isFullscreen = !this.isFullscreen;
	    }
  	}

}
