import { Component, OnInit } from '@angular/core';
import { CARDS_HELPERS } from './helpers.data';

@Component({
  selector: 'ngx-do-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  constructor() { }
cardsHelpers: any = CARDS_HELPERS;

  ngOnInit() {
  }
}
