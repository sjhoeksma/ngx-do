import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashcardComponent } from './dashcard/dashcard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { BarGraphComponent } from './bar-graph/bar-graph.component';
import { DoughnutGraphComponent } from './doughnut-graph/doughnut-graph.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PricingPlanComponent } from './pricing-plan/pricing-plan.component';
import { MatListModule } from '@angular/material/list';
import { WeatherComponent } from './weather/weather.component';
import { Ng2OdometerModule } from 'ng2-odometer';
import { SharePriceComponent } from './share-price/share-price.component';
import { RoundProgressbarComponent } from './round-progressbar/round-progressbar.component'; 
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { SalesListComponent } from './sales-list/sales-list.component';
import { D3UsaComponent } from './d3-usa/d3-usa.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { AiChatbotComponent } from './ai-chatbot/ai-chatbot.component';
import { AiChatbotService } from './ai-chatbot/ai-chatbot.service';
import { AiChatbotBarComponent } from './ai-chatbot-bar/ai-chatbot-bar.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SurveyComponent } from './survey/survey.component';
import { SurveyEditorComponent } from './survey-editor/survey-editor.component';
import { ShowdownModule, ConverterOptions, IConverterOptions } from 'ngx-showdown';
import { ReversePipe } from './pipes/reverse/reverse.pipe';
import { CallbackPipe } from './pipes/callback/callback.pipe';
import { TimeAgoPipe } from './pipes/timeago/timeago.pipe';
import { SafeUrlPipe } from './pipes/safe-url/safe-url.pipe';
import { KeysPipe } from './pipes/keys/keys.pipe';
import { RemoveDuplicatesPipe } from './pipes/remove-duplicates/remove-duplicates.pipe';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatListModule,
    Ng2OdometerModule,
    RoundProgressModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    ShowdownModule.forRoot({} as ConverterOptions | IConverterOptions),
  ],
  declarations: [
      DashcardComponent, 
      LineGraphComponent, 
      BarGraphComponent, 
      DoughnutGraphComponent, 
      ProfileCardComponent,
      PricingPlanComponent,
      WeatherComponent,
      SharePriceComponent,
      RoundProgressbarComponent,
      SalesListComponent,
      D3UsaComponent,
      WorldMapComponent,
      AiChatbotComponent,
      AiChatbotBarComponent,
      ReversePipe,
      KeysPipe,
      CallbackPipe,
      TimeAgoPipe,
      SafeUrlPipe,
      RemoveDuplicatesPipe,
      SurveyComponent,
      SurveyEditorComponent,
      ],
  exports: [
      DashcardComponent, 
      LineGraphComponent, 
      BarGraphComponent, 
      DoughnutGraphComponent, 
      ProfileCardComponent,
      PricingPlanComponent,
      WeatherComponent,
      SharePriceComponent,
      RoundProgressbarComponent,
      SalesListComponent,
      D3UsaComponent,
      WorldMapComponent,
      AiChatbotComponent,
      AiChatbotBarComponent,
      ReversePipe,
      CallbackPipe,
      TimeAgoPipe,
      KeysPipe,
      SafeUrlPipe,
      RemoveDuplicatesPipe,
      SurveyComponent,
      SurveyEditorComponent,
  ],
  providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        AiChatbotService,
    ]
})
export class WidgetsModule { }
