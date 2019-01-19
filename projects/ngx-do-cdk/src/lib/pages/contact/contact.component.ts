import { Component, OnInit } from '@angular/core';
import { CoreConfig } from '../../core/core.config';

@Component({
  selector: 'app-contacts',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
	checked = false;
  indeterminate = false;
  
  public editProfile(){}
  
  constructor(public coreConfig:CoreConfig) { }

  ngOnInit() {
  }
  employees = [
				{select: 'Hari', position: 'Full stack developer',image:'/assets/avatars/profile.jpg'},
				{select: 'Sujith', position: 'Full stack developer',image:'/assets/avatars/avatar.png'},
				{select: 'Ramya', position: 'Full stack developer',image:'/assets/avatars/noavatar.png'},
				{select: 'Sree', position: 'Full stack developer',image:'/assets/avatars/profile.jpg'},
				{select: 'Sruthy', position: 'Full stack developer',image:'/assets/avatars/noavatar.png'},
				{select: 'Fahad', position: 'Full stack developer',image:'/assets/avatars/profile.jpg'},
			];
}
