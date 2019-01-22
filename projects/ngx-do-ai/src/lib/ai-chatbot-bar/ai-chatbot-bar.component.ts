import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { AiChatbotService } from '../ai-chatbot/ai-chatbot.service';
import { AiChatbotComponent } from '../ai-chatbot/ai-chatbot.component';

@Component({
  selector: 'ngx-do-ai-chatbot-bar',
  templateUrl: './ai-chatbot-bar.component.html',
  styleUrls: ['./ai-chatbot-bar.component.scss']
})
export class AiChatbotBarComponent implements OnInit {
	public bigMenu;
  @Input() token;
  question: string;
  @ViewChild('aiSearch') aiSearchField;
  @ViewChild('aiBot') aiBot: AiChatbotComponent;

  constructor(public aiChatbot: AiChatbotService) {}

  private _open: boolean;
  @Input() set open(value: boolean) {
   if (!this._open && value) { this.focus(); }
   this._open = value;
  }

  get open(): boolean {
    return this._open;
  }

  ngOnInit() {
  }

  focus() {
    const $this = this;
    setTimeout(function() {
       $this.aiSearchField.nativeElement.focus();
     }, 50);
  }

  sendMessage() {
    if (this.question.length) { this.aiBot.sendMessage(this.question); }
    this.question = '';
  }

  clear() {
    this.aiBot.clear();
    if (this._open ) {this.focus(); }
  }



}
