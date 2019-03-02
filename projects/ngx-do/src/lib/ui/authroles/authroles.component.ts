import { Component } from '@angular/core';
import { MatDialog} from '@angular/material';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { CoreBackend } from '../../core/core.backend';
import { CoreConfig } from '../../core/core.config';


@Component({
  selector: 'ngx-do-authroles',
  templateUrl: './authroles.component.html',
  styleUrls: ['./authroles.component.scss']
})
export class AuthRolesComponent {

  editing = {};
  rows = [];
  roles = [];

  constructor(public dialog: MatDialog, private coreBackend: CoreBackend) {
     this.coreBackend.getList('roles').subscribe(data => {
      const grps = [];
      data.forEach(function(obj) {
         grps.push(obj.role);
      });
      this.roles = grps;
    });
    this.coreBackend.getList('authroles').subscribe(data => {
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
