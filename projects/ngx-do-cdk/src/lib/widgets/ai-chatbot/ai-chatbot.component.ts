
import {scan} from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { AiChatbotService, Message } from './ai-chatbot.service';

@Component({
  selector: 'cdk-ai-chatbot',
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.scss']
})
export class AiChatbotComponent implements OnInit {
  @Input() token;
  @Input() question = "";
  messages: Observable<Message[]>;

   constructor(public aiChatbot: AiChatbotService) {}
 
  ngOnInit() {
  }

  sendMessage(message:string) {
    if (!this.aiChatbot.hasClient(this.token)){
      this.messages = this.aiChatbot.conversation(this.token).asObservable().pipe(
        scan((acc, val) => acc.concat(val) ));
    }
    var msg = message || this.question;
    if (msg) this.aiChatbot.converse(msg,this.token);
  }
  
  clear(){
   this.aiChatbot.remove(this.token);
   this.messages = this.aiChatbot.conversation(this.token).asObservable().pipe(
        scan((acc, val) => acc.concat(val)));  
     
  }

}