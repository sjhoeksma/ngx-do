import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CoreConfig } from 'ngx-do';

@Component({
  selector: 'app-survey',
  templateUrl: './survey-editor.component.html',
  styleUrls: ['./survey-editor.component.scss']
})
export class SurveyEditorComponent implements OnInit {
 // Demo JSON
  json: object = {
      questions: [
          {
              name: 'name',
              type: 'text',
              title: 'Please enter your name:',
              placeHolder: 'Jon Snow',
              isRequired: true
          }, {
              name: 'birthdate',
              type: 'text',
              inputType: 'date',
              title: 'Your birthdate:',
              isRequired: true
          }, {
              name: 'color',
              type: 'text',
              inputType: 'color',
              title: 'Your favorite color:'
          }, {
              name: 'email',
              type: 'text',
              inputType: 'email',
              title: 'Your e-mail:',
              placeHolder: 'jon.snow@nightwatch.org',
              isRequired: true,
              validators: [
                  {
                      type: 'email'
                  }
              ]
          }, {
            type: 'checkbox',
            name: 'car',
            title: 'What car are you driving?',
            isRequired: true,
            hasNone: true,
            colCount: 4,
            choices: [
                'Ford',
                'Vauxhall',
                'Volkswagen',
                'Nissan',
                'Audi',
                'Mercedes-Benz',
                'BMW',
                'Peugeot',
                'Toyota',
                'Citroen'
            ]
        }
      ]
  };

  public onSave; // Used to store real onComplete
  constructor(private router: Router, private coreConfig: CoreConfig) {
    this.onSave = this._onSave.bind(this);
  }

  ngOnInit() {
    if (this.coreConfig.preferences['surveyjs']) {
      this.json = this.coreConfig.preferences['surveyjs'];
    }
    // this.router.routeReuseStrategy.shouldReuseRoute = function() {
    //    return false;
    // };
  }

  private _onSave(result, source) {
    this.json = result;
    this.coreConfig.preferences['surveyjs'] = this.json;
  }



}
