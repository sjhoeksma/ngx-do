import { Component, OnInit } from '@angular/core';
import { CoreConfig } from '../../core/core.config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public editProfile;
  public edit = false;
  constructor(public coreConfig: CoreConfig) {
     this.editProfile = this.editProfileCallback.bind(this);
  }

  ngOnInit() {
  }

  public editProfileCallback() {
    this.edit = !this.edit;
  }

}
