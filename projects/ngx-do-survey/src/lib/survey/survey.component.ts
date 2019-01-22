import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
import * as Survey from 'survey-angular';
import { ShowdownConverter } from 'ngx-showdown';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-do-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.theme.scss']
})

export class SurveyComponent implements OnDestroy, OnInit   {
    private subscription: Subscription;
    @Input() json;
    @Input() surveyJson;
    @Input() surveyData;
    @Input() onComplete;
    @Input() themeCss;
    @Input() readonly = false;
    @Input() widgets;
    private survey;

    constructor(
       private showdownConverter: ShowdownConverter
    ) {
    }

    public surveyJSmarkdown(o: any): void {
     if (o.markdown) {
      if (Array.isArray(o.markdown)) {
        o.markdown = o.markdown.join('\n');
      }
        o.html = this.showdownConverter.makeHtml(o.markdown);
        delete o.markdown;
      } else if (o.html) {
        if (Array.isArray(o.html)) {
          o.html = o.html.join('\n');
        }
        let i1;
        let i2;
        do {
          i1 = o.html.indexOf('<showdown>');
          i2 = o.html.indexOf('</showdown>');
          if (i1 >= 0 && i2 >= 0) {
            o.html = o.html.substring(0, i1) +
                  this.showdownConverter.makeHtml(o.html.substring(i1 + 10, i2 - 1)) +
                  o.html.substring(i2 + 11);
          }
        } while (i1 >= 0 && i2 >= 0);
      }
      for (const p in o) {
        if ( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
          this.surveyJSmarkdown(o[p]);
        }
      }
    }

    private updateJson(data: any) {
      const $this = this;
      const d = data['data'];
      delete data['data'];
      this.surveyJSmarkdown(data);
      this.survey = new Survey.Model(data);
      this.survey.mode = this.readonly ? 'display' : 'edit';
      this.survey.onTextMarkdown.add(function(survey, options) {
            // convert the mardown text to html
            let str = $this.showdownConverter.makeHtml(options.text);
            // remove root paragraphs <p></p>
            str = str.substring(3);
            str = str.substring(0, str.length - 4);
            // set html
            options.html = str;
      });
      this.survey.onComplete.add(this.onComplete);
      if (d) { this.survey.data = d; }
      this.survey.render('surveyElement');
      if (this.survey.isEmpty && this.onComplete) {
        this.onComplete(this.survey.data);
      }
    }

    ngOnInit() {
      /* SurveyJS needs common configuration before it works with our themes
       * For variables see: https://github.com/surveyjs/surveyjs/blob/master/src/defaultCss/cssstandard.ts
      */
       const themeCss = Object.assign({
        navigationButton: 'mat-button btn-primary',
        navigation: {
          complete: 'sv_complete_btn mat-button btn-primary',
          prev: 'sv_prev_btn mat-button btn-basic',
          next: 'sv_next_btn mat-button btn-primary',
          start: 'sv_start_btn mat-button btn-primary'
        },
        row: '',
      }, this.themeCss);

      // Copy theme into default
      Object.keys(themeCss).forEach(function(key) {
       Survey.defaultStandardCss[key] = themeCss[key];
      });
      if (this.widgets) {
        if (Array.isArray(this.widgets)) {
          this.widgets.forEach(function (widget) {
            Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customtype');
          });
        } else {
           Survey.CustomWidgetCollection.Instance.addCustomWidget(this.widgets, 'customtype');
        }
      }
      Survey.StylesManager.applyTheme();

      if (this.surveyJson) {
        const jsonSubject: Subject<object> = new Subject<object>();
        this.json = jsonSubject.asObservable();
        this.subscription = this.json.subscribe((update: object) => {
           if (update) { this.updateJson(update); }
         });
        jsonSubject.next(Object.assign(this.surveyJson, this.surveyData ? {data: this.surveyData} : {}));
      } else if (this.json) {
         this.subscription = this.json.subscribe((update: object) => {
           if (update) { this.updateJson(update); }
         });
      }
    }

    ngOnDestroy() {
      if (this.subscription) { this.subscription.unsubscribe(); }
    }
}
