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
import { FormsModule } from '@angular/forms';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { SecurityComponent } from './security/security.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { KeyVaultComponent } from './keyvault/keyvault.component';
import { CoreModule,UiModule } from 'ngx-do';

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
        UiModule,
        CoreModule,
    ],
    declarations: [
        ContactComponent,
        AboutComponent,
        ErrorComponent,
        ProfileCardComponent,
        ProfileComponent,
        SecurityComponent,
        KeyVaultComponent,
    ],
    exports:[
      ContactComponent,
        AboutComponent,
        ErrorComponent,
        ProfileCardComponent,
        ProfileComponent,
        SecurityComponent,
        KeyVaultComponent,
    ]
})
export class PagesModule {
}
