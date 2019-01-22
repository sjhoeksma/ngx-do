import { Component, OnInit, Input } from '@angular/core';
import { CoreConfig,ToolbarComponent } from 'ngx-do';


@Component({
  selector: 'ngx-do-ai-toolbar',
  templateUrl: './ai-toolbar.component.html',
  styleUrls: ['./ai-toolbar.component.scss']
})
export class AiToolbarComponent extends ToolbarComponent {

  @Input() aiChatbotShow = false;
  @Input() aiToken;
  @Input() tipChatbot = 'Interactive help';
  aiChatbotOpen = false;
  
}
