import { Component } from '@angular/core';
import { MatDialog} from '@angular/material';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'ngx-do-keyvault',
  templateUrl: './keyvault.component.html',
  styleUrls: ['./keyvault.component.scss']
})
export class KeyVaultComponent {
  editing = {};
  rows = [];
  roles = [];
  keyvault;

  constructor(public dialog: MatDialog, private restangular: Restangular) {
    this.restangular.all('roles').getList().subscribe(data => {
      const grps = [];
      data.forEach(function(obj) {
         grps.push(obj.role);
      });
      this.roles = grps;
    });
    this.keyvault = this.restangular.all('keyvault');
    this.keyvault.getList().subscribe(data => {
      this.rows = data;
    });

  }


  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    if (this.rows[rowIndex].save) {
      this.rows[rowIndex].save(); // Save the key
    } else {
      this.keyvault.post(this.rows[rowIndex]).subscribe((data) => {
         this.rows[rowIndex] = data;
       });
    }
    this.rows = [...this.rows];
  }

  updateMatValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.value;
    if (this.rows[rowIndex].save) {
      this.rows[rowIndex].save(); // Save the key
    } else {
      this.keyvault.post(this.rows[rowIndex]).subscribe((data) => {
         this.rows[rowIndex] = data;
       });
    }
    this.rows = [...this.rows];
  }

   openedMatValue(event, cell, rowIndex) {
    if (!event) { this.editing[rowIndex + '-' + cell] = false; }
  }

  delete(rowIndex) {
    const dialogRef = this.dialog.open(ConfirmDialog,
        {data: {text: 'You want to remove the key'}});

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.rows[rowIndex].remove) {
            this.rows[rowIndex].remove();
          }
          const rows = [...this.rows];
          rows.splice(rowIndex, 1);
          this.rows = [...rows];
        }
    });
  }

  addRow() {
    if (this.rows.length === 0 || this.rows[this.rows.length - 1].value) {
      this.rows = [...this.rows, {id: null, value: '', roles: ['default']}];
    }
  }
}
