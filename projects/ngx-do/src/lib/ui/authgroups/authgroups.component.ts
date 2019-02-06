import { Component } from '@angular/core';
import { MatDialog} from '@angular/material';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { CoreBackend } from '../../core/core.backend';
import { CoreConfig } from '../../core/core.config';


@Component({
  selector: 'ngx-do-authgroups',
  templateUrl: './authgroups.component.html',
  styleUrls: ['./authgroups.component.scss']
})
export class AuthGroupsComponent {

  editing = {};
  rows = [];
  groups = [];

  constructor(public dialog: MatDialog, private coreBackend: CoreBackend) {
     this.coreBackend.getList('groups').subscribe(data => {
      const grps = [];
      data.forEach(function(obj) {
         grps.push(obj.group);
      });
      this.groups = grps;
    });
    this.coreBackend.getList('authgroups').subscribe(data => {
      this.rows = data;
    });

  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.rows[rowIndex].save();
  }

  updateMatValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.value || ['default'];
    this.rows = [...this.rows];
    this.rows[rowIndex].save();
  }

   openedMatValue(event, cell, rowIndex) {
    if (!event) { this.editing[rowIndex + '-' + cell] = false; }
  }

}
