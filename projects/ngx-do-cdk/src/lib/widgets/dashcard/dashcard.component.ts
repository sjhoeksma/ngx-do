import { Component, OnInit ,Input } from '@angular/core';
import { Observable ,  Observer } from 'rxjs';
@Component({
    selector: 'cdk-dashcard',
    templateUrl: './dashcard.component.html',
    styleUrls: ['./dashcard.component.theme.scss']
})
export class DashcardComponent implements OnInit {
     
    @Input() dashData: any;
    
    constructor() {

     }

    ngOnInit() {
    }

}
