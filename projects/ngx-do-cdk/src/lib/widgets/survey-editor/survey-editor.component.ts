import { Component, Input, OnInit } from '@angular/core';
import *  as SurveyEditor from 'surveyjs-editor';

@Component({
  selector: 'cdk-survey-editor',
  templateUrl: './survey-editor.component.html',
  styleUrls: ['./survey-editor.component.theme.scss']
})
export class SurveyEditorComponent implements OnInit {

  @Input() surveyJson;
  @Input() onSave;
  @Input() options;
  @Input() licensed;

  constructor() {
  }

  ngOnInit() {
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
    var editor = new SurveyEditor.SurveyEditor("surveyEditorContainer", editorOptions);
     if (this.surveyJson) 
       editor.text = (this.surveyJson === 'string') ? this.surveyJson : JSON.stringify(this.surveyJson);
    //set function on save callback
     
     editor.saveSurveyFunc = function(){
      if (this.onSave) {  
        this.onSave(JSON.parse(editor.text));  
      } else {
        this.surveyJson=JSON.parse(editor.text); 
      }
     }.bind(this);
  }
  

}