import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import *  as SurveyEditor from 'surveyjs-editor';
import { Observable, Subject,Subscription } from 'rxjs';

@Component({
  selector: 'cdk-survey-editor',
  templateUrl: './survey-editor.component.html',
  styleUrls: ['./survey-editor.component.theme.scss']
})
export class SurveyEditorComponent implements OnInit {
  private subscription : Subscription;  
  @Input() json;
  @Input() surveyJson;
  @Input() surveyData;
  @Input() onSave;
  @Input() options;
  @Input() licensed;
  private editor:any;
  constructor() {
  }
  
  private updateJson(data:any){
    var editorOptions = Object.assign({
     // show the embeded survey tab. It is hidden by default
     showEmbededSurveyTab : false,
     // hide the test survey tab. It is shown by default
     showTestSurveyTab : false,
     // hide the JSON text editor tab. It is shown by default
     showJSONEditorTab : false,
     // show the "Options" button menu. It is hidden by default 
     showOptions: false,  
     //Auto Save the editor
     isAutoSave: true, 
     //Remove the license header
     haveCommercialLicense: this.licensed 
    },this.options);
    this.editor = new SurveyEditor.SurveyEditor("surveyEditorContainer", editorOptions);
    this.editor.text = (data === 'string') ? data : JSON.stringify(data);
     this.editor.saveSurveyFunc = function(){
      if (this.onSave) {  
        this.onSave(JSON.parse(this.editor.text));  
      } else {
        this.surveyJson=JSON.parse(this.editor.text); 
      }
     }.bind(this);
  }

  ngOnInit() {
     if (this.surveyJson){
        let jsonSubject: Subject<object> = new Subject<object>();
        this.json=jsonSubject.asObservable();
        this.subscription = this.json.subscribe((update:object) => {
           if (update) this.updateJson(update);
         });
        jsonSubject.next(this.surveyJson);
      } else if (this.json){
         this.subscription = this.json.subscribe((update:object) => {
           if (update) this.updateJson(update);
         });
      }    
  }
  
  ngOnDestroy(){
      if (this.subscription) this.subscription.unsubscribe();
    }
  

}