import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { CoreEvent } from '../../core/core.event';

@Component({
  selector: 'ngx-do-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: ['./toolbar-notification.component.scss']
})
export class ToolbarNotificationComponent implements OnInit {
	cssPrefix = 'toolbar-notification';
  	isOpen = false;
  	@Input() notifications = [];

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

  	constructor(private elementRef: ElementRef, private coreEvent: CoreEvent) { }

  	ngOnInit() {
  	}

    allread() {
      this.isOpen = false;
      this.coreEvent.send('notification.clear', CoreEvent.core_channel);
    }

  	select(event: Event, notification) {
      event.stopPropagation();
      notification.read = true; this.coreEvent.send({event: 'notification.select', notification: notification},
                          CoreEvent.core_channel);
       this.isOpen = false;
  	}

  	delete(event: Event, notification) {
      event.stopPropagation();
      this.coreEvent.send({event: 'notification.delete', notification: notification},
                          CoreEvent.core_channel);
  	}

}
