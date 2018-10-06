import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/scan';
import { AiChatbotService, Message } from '../ai-chatbot/ai-chatbot.service';
import { AiChatbotComponent } from '../ai-chatbot/ai-chatbot.component';
import { ReversePipe } from '../pipes/reverse/reverse.pipe';

@Component({
  selector: 'cdk-ai-chatbot-bar',
  templateUrl: './ai-chatbot-bar.component.html',
  styleUrls: ['./ai-chatbot-bar.component.scss']
})
export class AiChatbotBarComponent implements OnInit {
	public bigMenu;
  @Input() token;
  question: string;
  @ViewChild("aiSearch") aiSearchField : ElementRef;
  @ViewChild("aiBot") aiBot : AiChatbotComponent;
  
  constructor(public aiChatbot: AiChatbotService) {}
  
  private _open: boolean;
  @Input() set open(value: boolean) {
   if (!this._open && value) this.focus();
   this._open = value;
  }

  get open(): boolean {
    return this._open;
  }
  
  ngOnInit() {
  }
  
  focus(){
    let $this = this;
    setTimeout(function(){
       $this.aiSearchField.nativeElement.focus();
     },50);
  }
  
  sendMessage(){
    if (this.question.length){ this.aiBot.sendMessage(this.question)}
    this.question="";
  }
  
  clear(){
    this.aiBot.clear();
    if (this._open )this.focus();
  }
  


}
