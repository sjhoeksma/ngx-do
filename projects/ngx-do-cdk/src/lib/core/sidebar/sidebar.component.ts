import { Component, OnInit } from '@angular/core';
import { CoreConfig } from '../core.config';

@Component({
  selector: 'cdk-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    protected coreConfig: CoreConfig
  ) { }

  today: number = Date.now();
  // public bufferValue;

  events = this.coreConfig.events;
  todoList = this.coreConfig.todoList;
  messages = this.coreConfig.messages;

  ngOnInit() {
  }
}
