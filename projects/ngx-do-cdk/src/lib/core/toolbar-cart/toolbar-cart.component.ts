import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { CoreEvent } from '../core.event';
import { Router } from '@angular/router';

@Component({
  selector: 'cdk-toolbar-cart',
  templateUrl: './toolbar-cart.component.html',
  styleUrls: ['./toolbar-cart.component.scss']
})
export class ToolbarCartComponent implements OnInit {
	  cssPrefix = 'toolbar-cart';
  	isOpen = false;
  	@Input() basket = [];
    @Input() checkoutRoute;

    @HostListener('document:click', ['$event', '$event.target'])
      onClick(event: MouseEvent, targetElement: HTMLElement) {
         if (!targetElement) {
               return;
         }
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
         if (!clickedInside) {
              this.isOpen = false;
         }
     }

  	constructor(private elementRef: ElementRef, private coreEvent: CoreEvent, private router: Router) { }

  	ngOnInit() {
  	}

    clearAll() {
      this.isOpen = false;
      this.coreEvent.send('cart.clear', CoreEvent.core_channel);
    }

  	select(event: Event, article) {
      event.stopPropagation();
      this.coreEvent.send({event: 'cart.select', article: article}, CoreEvent.core_channel);
      this.isOpen = false;
  	}

  	delete(event: Event, article) {
      event.stopPropagation();
      this.coreEvent.send({event: 'cart.delete', article: article}, CoreEvent.core_channel);
  	}

    checkout() {
      this.coreEvent.send({event: 'cart.checkout'}, CoreEvent.core_channel);
      if (this.checkoutRoute) { this.router.navigate([this.checkoutRoute]); }
    }

}
