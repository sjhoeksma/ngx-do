import { Component } from '@angular/core';
import { MatDialog} from '@angular/material';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { CoreBackend } from '../../core/core.backend';
import { CoreConfig } from '../../core/core.config';


@Component({
  selector: 'ngx-do-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CRUDComponent {

  editing = {};
  rows = [];
  tables = [];
  rest: any;

  constructor(public dialog: MatDialog, private coreBackend: CoreBackend) {
    this.coreBackend.getOne('CRUD', this.coreBackend.authId).subscribe(data => {
      this.rest = data;
      this.tables = data.tables || [];
      this.rows = data.crud || [];
    });
  }

  CRUD(code, row): boolean {
    return this.rows[row].CRUD.indexOf(code) >= 0;
  }

  save() {
    this.rest.crud = this.rows;
    this.rest.save();
  }

  updateCRUD(code, row) {
    if (this.CRUD(code, row)) {
       this.rows[row].CRUD = this.rows[row].CRUD.replace(code, '');
    } else {
      this.rows[row].CRUD += code;
    }
    this.save();
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.save();
  }

  updateMatValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.value;
    this.rows = [...this.rows];
    this.save();
  }

   openedMatValue(event, cell, rowIndex) {
    if (!event) { this.editing[rowIndex + '-' + cell] = false; }
  }
  

  deleteCRUD(rowIndex) {
    let dialogRef = this.dialog.open(ConfirmDialog, 
        {data: {text:"You want to remove the rights"}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const rows = [...this.rows];
        rows.splice(rowIndex, 1);
        this.rows = [...rows];
        this.save();
      }
    });
  }

  addRow() {
    if (this.rows.length === 0 || this.rows[this.rows.length - 1].user) {
      this.rows = [...this.rows, {user: null, table: '', CRUD: ''}];
    }
  }
}
