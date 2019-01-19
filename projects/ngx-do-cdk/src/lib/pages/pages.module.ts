import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatListModule,
       } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShowdownModule, ConverterOptions, IConverterOptions } from 'ngx-showdown';
import { FormsModule } from '@angular/forms';
import { WidgetsModule } from '../widgets/widgets.module';
import { CoreModule } from '../core/core.module';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { SecurityComponent } from './security/security.component';
import { ProfileComponent } from './profile/profile.component';
import { KeyVaultComponent } from './keyvault/keyvault.component';
import { PerfectScrollbarModule ,
        PERFECT_SCROLLBAR_CONFIG ,
        PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

import {pagesRoutes} from './pages.routes';

@NgModule({
    imports: [
        NgxDatatableModule,
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatListModule,
        MatChipsModule,
        FormsModule,
        MatTabsModule,
        WidgetsModule,
        PerfectScrollbarModule,
        CoreModule,
        ShowdownModule.forRoot({} as ConverterOptions | IConverterOptions),
        RouterModule.forChild(pagesRoutes)
    ],
    declarations: [
        ContactComponent,
        AboutComponent,
        ErrorComponent,
        ProfileComponent,
        SecurityComponent,
        KeyVaultComponent,
    ],
    exports: [
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }]
})
export class PagesModule {
}
