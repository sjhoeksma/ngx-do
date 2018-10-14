import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
import * as Survey from 'survey-angular';
import { ShowdownConverter } from 'ngx-showdown'; 
import { Observable, Subject,Subscription } from 'rxjs';

/* SurveyJS needs common configuration before it works with our themes
 * For variables see: https://github.com/surveyjs/surveyjs/blob/master/src/stylesmanager.ts
*/
{                                  
  var themeCss ={
    root: "sv_main sv_default_css",
    header: "sv_header",
    body: "sv_body",
    footer: "sv_nav",
    navigationButton: "mat-button  btn-primary",
    completedPage: "sv_completed_page",
    navigation: {
      complete: "mat-button sv_complete_btn btn-primary",
      prev: "mat-button sv_prev_btn btn-basic",
      next: "mat-button sv_next_btn btn-primary",
      start: "mat-button sv_start_btn btn-primary"
    },
    progress: "sv_progress",
    progressBar: "sv_progress_bar",
    page: {
      root: "sv_p_root",
      title: "",
      description: ""
    },
    // TODO: move to the page object
    pageTitle: "sv_page_title",
    pageDescription: "",
    row: "",//"sv_row",
    question: {
      mainRoot: "sv_q sv_qstn",
      title: "sv_q_title",
      description: "sv_q_description",
      comment: "",
      required: "",
      titleRequired: "",
      hasError: "",
      indent: 20,
      footer: "sv_q_footer"
    },
    panel: { title: "sv_p_title", description: "", container: "sv_p_container" },
    error: { root: "sv_q_erbox", icon: "", item: "" },

    boolean: {
      root: "sv_qcbc sv_qbln",
      item: "sv_q_checkbox",
      label: "",
      materialDecorator: "checkbox-material"
    },
    checkbox: {
      /*
      root: "sv_qcbc sv_qcbx",
      item: "sv_q_checkbox",
      label: "sv_q_checkbox_label",
      itemControl: "sv_q_checkbox_control_item",
      controlLabel: "sv_q_checkbox_control_label",
      materialDecorator: "checkbox-material",
      other: "sv_q_other sv_q_checkbox_other"
      */
      root: "sv_qcbc sv_qcbx",
      item: "checkbox",
      label: "sv_q_checkbox_label",
      itemControl: "",
      controlLabel: " ",
      materialDecorator: "checkbox-material",
      other: "sv_q_other form-control"
    },
    comment: "",
    dropdown: {
      root: "",
      control: "sv_q_dropdown_control",
      selectWrapper: "sv_select_wrapper",
      other: "sv_q_dd_other"
    },
    matrix: {
      root: "sv_q_matrix",
      label: "sv_q_m_label",
      cellText: "sv_q_m_cell_text",
      cellTextSelected: "sv_q_m_cell_selected",
      cellLabel: "sv_q_m_cell_label"
    },
    matrixdropdown: { root: "sv_q_matrix_dropdown" },
    matrixdynamic: {
      root: "sv_q_matrix_dynamic",
      button: "sv_matrix_dynamic_button",
      buttonAdd: "",
      buttonRemove: ""
    },
    paneldynamic: {
      root: "sv_panel_dynamic",
      title: "sv_p_title",
      button: "",
      buttonPrev: "",
      buttonNext: "",
      buttonAdd: "",
      buttonRemove: ""
    },
    multipletext: {
      root: "sv_q_mt",
      itemTitle: "sv_q_mt_title",
      row: "sv_q_mt_row",
      itemValue: "sv_q_mt_item_value sv_q_text_root"
    },
    radiogroup: {
      root: "sv_qcbc",
      item: "sv_q_radiogroup",
      label: "sv_q_radiogroup_label",
      itemControl: "sv_q_radiogroup_control_item",
      controlLabel: "",
      materialDecorator: "circle",
      other: "sv_q_other sv_q_radiogroup_other",
      clearButton: "sv_q_radiogroup_clear"
    },
    imagepicker: {
      root: "sv_imgsel",
      item: "sv_q_imgsel",
      label: "sv_q_imgsel_label",
      itemControl: "sv_q_imgsel_control_item",
      image: "sv_q_imgsel_image",
      itemText: "sv_q_imgsel_text",
      clearButton: "sv_q_radiogroup_clear"
    },
    rating: {
      root: "sv_q_rating",
      item: "sv_q_rating_item",
      selected: "active",
      minText: "sv_q_rating_min_text",
      itemText: "sv_q_rating_item_text",
      maxText: "sv_q_rating_max_text"
    },
    /*
    	<div fxFlex="50" fxLayout.lt-lg="100">
					<mat-form-field >
					<input  matInput placeholder="Office">
				</mat-form-field>
    */
    text: "mat-input",
    expression: "mat-input-element",
    file: {
      root: "sv_q_file",
      placeholderInput: "sv_q_file_placeholder",
      preview: "sv_q_file_preview",
      removeButton: "sv_q_file_remove_button",
      fileInput: "sv_q_file_input",
      removeFile: "sv_q_file_remove"
    },
    saveData: {
      root: "",
      saving: "",
      error: "",
      success: "",
      saveAgainButton: ""
    },
    window: {
      root: "sv_window",
      body: "sv_window_content",
      header: {
        root: "sv_window_title",
        title: "",
        button: "",
        buttonExpanded: "",
        buttonCollapsed: ""
      }
    }
  };
  //Copy theme into default
  Object.keys(themeCss).forEach(function(key) {
   Survey.defaultStandardCss[key] = themeCss[key];
  });                                        
                                          
  Survey.StylesManager.applyTheme();   
}

@Component({
  selector: 'cdk-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})

export class SurveyComponent implements OnDestroy, OnInit   {
    private subscription : Subscription;
    @Input() json;
    @Input() onComplete;
    @Input() readonly = false;
    private survey;

    constructor(
       private showdownConverter: ShowdownConverter
    ) {
      
    }
  
    public surveyJSmarkdown(o:any): void{
     if (o.markdown) {
      if (Array.isArray(o.markdown))
        o.markdown = o.markdown.join("\n");
        o.html = this.showdownConverter.makeHtml(o.markdown);
        delete o.markdown;
      } else if (o.html) {
        if (Array.isArray(o.html))
          o.html = o.html.join("\n");
        let i1;
        let i2;
        do {
          i1 = o.html.indexOf("<showdown>");
          i2 = o.html.indexOf("</showdown>");
          if (i1>=0 && i2>=0){
            o.html=o.html.substring(0, i1) + 
                  this.showdownConverter.makeHtml(o.html.substring(i1+10, i2-1)) +
                  o.html.substring(i2+11);
          }
        } while (i1>=0 && i2>=0)
      }
      var result, p; 
      for (p in o) {
        if( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
          this.surveyJSmarkdown(o[p]);
        }
      }
    }
    
    private updateJson(data:any){
      let $this = this;
      let d = data['data'];
      delete data['data'];
      this.surveyJSmarkdown(data);
      this.survey = new Survey.Model(data);
      this.survey.mode=this.readonly ? 'display' : 'edit';
      this.survey.onTextMarkdown.add(function(survey, options){
            //convert the mardown text to html
            var str = $this.showdownConverter.makeHtml(options.text);
            //remove root paragraphs <p></p>
            str = str.substring(3);
            str = str.substring(0, str.length - 4);
            //set html
            options.html = str;
      });
      this.survey.onComplete.add(this.onComplete);
      if (d) this.survey.data=d;     
      this.survey.render("surveyElement");
      if (this.survey.isEmpty && this.onComplete) {
        this.onComplete(this.survey.data);
      }
    }
   
    ngOnInit() {
      if (this.json){
         this.subscription = this.json.subscribe((update:object) => {
           if (update) this.updateJson(update);
         });
      }
    }

    ngOnDestroy(){
      if (this.subscription) this.subscription.unsubscribe();
    }
}
