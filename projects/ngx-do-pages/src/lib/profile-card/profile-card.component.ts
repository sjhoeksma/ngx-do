import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-do-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.theme.scss']
})
export class ProfileCardComponent implements OnInit {
    @Input() profile;
    @Input() doClick;
    @Input() clickLabel;

    constructor() { }

    ngOnInit() {
    }

}
