import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cdk-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.theme.scss']
})
export class ProfileCardComponent implements OnInit {
    @Input() profile;
    @Input() onClick;
    @Input() clickLabel;

    constructor() { }

    ngOnInit() {
    }

}
