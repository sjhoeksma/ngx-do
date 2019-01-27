import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ngx-do-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{title}}</h2>
    <mat-dialog-content class="mat-typography">
      <h3>{{question}}</h3>
      <p>{{text}}</p>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close cdkFocusInitial>Cancel</button>
      <button mat-button [mat-dialog-close]="true" >Confirm</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialog implements OnInit {
 title = 'Please Confirm';
 question = 'Are your sure ?';
 text = 'You want to perform the action';
 constructor(
  @Inject(MAT_DIALOG_DATA) private data: any,
  public  dialogRef: MatDialogRef<ConfirmDialog>) {}
  public ngOnInit() {
    if (this.data.title) { this.title = this.data.title; }
    if (this.data.question) { this.question = this.data.question; }
    if (this.data.text) { this.text = this.data.text; }
  }
}
