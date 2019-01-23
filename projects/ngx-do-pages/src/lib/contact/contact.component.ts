import { Component, OnInit } from '@angular/core';
import { CoreConfig } from 'ngx-do';

@Component({
  selector: 'app-contacts',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(public coreConfig: CoreConfig) { }
	checked = false;
  indeterminate = false;
  employees = [
				{select: 'Hari', position: 'Full stack developer', image: '/assets/do/avatars/profile.jpg'},
				{select: 'Sujith', position: 'Full stack developer', image: '/assets/do/avatars/avatar.png'},
				{select: 'Ramya', position: 'Full stack developer', image: '/assets/do/avatars/noavatar.png'},
				{select: 'Sree', position: 'Full stack developer', image: '/assets/do/avatars/profile.jpg'},
				{select: 'Sruthy', position: 'Full stack developer', image: '/assets/do/avatars/noavatar.png'},
				{select: 'Fahad', position: 'Full stack developer', image: '/assets/do/avatars/profile.jpg'},
			];

  public editProfile() {}

  ngOnInit() {
  }
}
