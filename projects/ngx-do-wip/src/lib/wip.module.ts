import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule,MatInputModule ,MatIconModule , MatMenuModule ,
        MatChipsModule, MatFormFieldModule,MatProgressBarModule,MatListModule,
       MatToolbarModule,MatTabsModule} from '@angular/material';
import { Ng2OdometerModule } from 'ng2-odometer';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { DashcardComponent } from './dashcard/dashcard.component';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { BarGraphComponent } from './bar-graph/bar-graph.component';
import { DoughnutGraphComponent } from './doughnut-graph/doughnut-graph.component';
import { PricingPlanComponent } from './pricing-plan/pricing-plan.component';
import { WeatherComponent } from './weather/weather.component';
import { SharePriceComponent } from './share-price/share-price.component';
import { RoundProgressbarComponent } from './round-progressbar/round-progressbar.component';
import { SalesListComponent } from './sales-list/sales-list.component';
import { D3UsaComponent } from './d3-usa/d3-usa.component';
import { WorldMapComponent } from './world-map/world-map.component';

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
  ],
  declarations: [
      DashcardComponent,
      LineGraphComponent,
      BarGraphComponent,
      DoughnutGraphComponent,
      PricingPlanComponent,
      WeatherComponent,
      SharePriceComponent,
      RoundProgressbarComponent,
      SalesListComponent,
      D3UsaComponent,
      WorldMapComponent,
      ],
  exports: [
      DashcardComponent,
      LineGraphComponent,
      BarGraphComponent,
      DoughnutGraphComponent,
      PricingPlanComponent,
      WeatherComponent,
      SharePriceComponent,
      RoundProgressbarComponent,
      SalesListComponent,
      D3UsaComponent,
      WorldMapComponent,
  ]
})
export class WipModule { }
