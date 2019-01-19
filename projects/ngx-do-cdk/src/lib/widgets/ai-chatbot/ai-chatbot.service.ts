/* AiChatbotService: Have a smart conversation with your customer using DialogFlow
Create a chatbot conversation with DialogFlow and pass the token though 
A. the enviroment property 'aiChatbotToken'
B. using the token property in the component
*/

import { Injectable } from '@angular/core';
//import { ApiAiClient } from 'api-ai-javascript';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { Observable ,  BehaviorSubject } from 'rxjs';

// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {}
}

export class ClientConversation {
  conversation = new BehaviorSubject<Message[]>([]);
  aiClient : ApiAiClient;
  constructor(private token:string){
    if (this.token)
      this.aiClient = new ApiAiClient({ accessToken: this.token });
  }
}

@Injectable()
export class AiChatbotService {

  private clients : object = {};
 
  constructor() {}
  
  client(token:string): ClientConversation{
    if (!token) throw "No 'aiChatbotToken' set in environment file"
    var cl : ClientConversation = this.clients[token];
    if (cl) return cl;
    cl = new ClientConversation(token)
    this.clients[token]=cl;
    return cl;
  }
  
  hasClient(token:string):boolean {
    return this.clients[token]!=null;
  }
  
  conversation(token:string): BehaviorSubject<Message[]>{
    return this.client(token).conversation;
  }

  // Sends and receives messages via DialogFlow
  converse(msg: string,token: string) {
   try {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage,token);
    return this.client(token).aiClient.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Message(speech, 'bot');
                  this.update(botMessage,token);
               });
    } catch (ex){
       console.error("Failed to connect to DialogFlow",ex);
      this.update(new Message("Oops Internal errror...",'bot'),token);
    }
  }

  // Adds message to source
  update(msg: Message,token:string) {
    this.client(token).conversation.next([msg]);
  }
  
  remove(token:string){
    if (this.hasClient(token)) {
      this.client(token).conversation.complete();
      delete this.clients[token];
    }
  }
}