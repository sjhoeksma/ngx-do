import { NgModule } from '@angular/core';
import { 
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatListModule,
        MatSelectModule,
        MatDialogModule,
       } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShowdownModule, ConverterOptions, IConverterOptions } from 'ngx-showdown';

import { WidgetsModule } from 'ngx-do-cdk';
import { PagesRouterModule } from './pages.routes';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { ProfileComponent } from './profile/profile.component';
import { KeyVaultComponent } from './keyvault/keyvault.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SecurityComponent } from './security/security.component'

import { CoreModule } from 'ngx-do-cdk';

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
        WidgetsModule,
        MatSelectModule,
        MatDialogModule,
        CoreModule,
        ShowdownModule.forRoot({} as ConverterOptions | IConverterOptions),
        PagesRouterModule ],
    declarations: [   
        ContactComponent,
        AboutComponent,
        ErrorComponent,
        ProfileComponent,
        KeyVaultComponent,
        SecurityComponent,
    ],
    exports: [
      
    ],
    providers: [
    ]
})
export class PagesModule {
}
