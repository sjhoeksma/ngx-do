import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CoreEvent } from '../core.event';

@Component({
  selector: 'cdk-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})

export class SearchBarComponent implements OnInit {
	public bigMenu;
  @ViewChild('search') searchField: ElementRef;
  private _open: boolean;
  public searchValue;


	constructor(private coreEvent: CoreEvent) { }

	ngOnInit() {}

  @Input() set open(value: boolean) {
   const $this = this;
   if (!this._open && value) {
     this.searchValue = '';
     setTimeout(function() {
       $this.searchField.nativeElement.focus();
     }, 50);
   }
   this._open = value;
  }

  get open(): boolean {
    return this._open;
  }

  public doSearch(value): void {
    this.coreEvent.send({event: 'search', value: value}, CoreEvent.core_channel);
  }

}
