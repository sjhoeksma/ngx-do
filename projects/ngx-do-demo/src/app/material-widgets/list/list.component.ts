import { Component, OnInit } from '@angular/core';
import { LIST_HELPERS,  Messages, Links} from './helpers.data';

@Component({
  selector: 'ngx-do-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  // animations: [fadeAnimation]
})
export class ListComponent implements OnInit {

    listHelpers: any = LIST_HELPERS;
     links = Links;

    showMultiListCode = false;
     messages = Messages;
    constructor() { }

    ngOnInit() {
    }


}
