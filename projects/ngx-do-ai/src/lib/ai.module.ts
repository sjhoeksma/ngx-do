import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule , MatListModule , MatButtonModule , MatInputModule , MatIconModule, MatToolbarModule , MatChipsModule , MatFormFieldModule, MatTabsModule, MatOptionModule,  MatSidenavModule, MatSliderModule, MatProgressBarModule, MatSelectModule, MatButtonToggleModule, MatCheckboxModule, MatSnackBarModule, MatTooltipModule} from '@angular/material';
import { AiChatbotComponent } from './ai-chatbot/ai-chatbot.component';
import { AiChatbotService } from './ai-chatbot/ai-chatbot.service';
import { AiChatbotBarComponent } from './ai-chatbot-bar/ai-chatbot-bar.component';
import { AiToolbarComponent } from './ai-toolbar/ai-toolbar.component';
import { CoreModule,PipesModule,UiModule} from 'ngx-do';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG , PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatOptionModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatProgressBarModule,
    PerfectScrollbarModule,
    PipesModule,
    CoreModule,
    UiModule
  ],
  declarations: [
    AiToolbarComponent,
    AiChatbotBarComponent,
    AiChatbotComponent
      ],
  exports: [
    AiToolbarComponent,
    AiChatbotBarComponent,
    AiChatbotComponent
  ],
  providers:[
    AiChatbotService,
    {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
    ]
})
export class AiModule { }
