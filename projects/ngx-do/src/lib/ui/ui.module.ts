import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatCardModule , MatListModule , MatButtonModule , MatInputModule , MatIconModule, MatToolbarModule , MatChipsModule , MatFormFieldModule, MatTabsModule, MatOptionModule,  MatSidenavModule, MatSliderModule, MatProgressBarModule, MatSelectModule, MatButtonToggleModule, MatCheckboxModule, MatSnackBarModule, MatTooltipModule} from '@angular/material';

import { NgxDoPipesModule} from '../pipes/pipes.module';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { SidemenuItemComponent } from './sidemenu-item/sidemenu-item.component';
import { ToolbarNotificationComponent } from './toolbar-notification/toolbar-notification.component';
import { ToolbarCartComponent } from './toolbar-cart/toolbar-cart.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { LogoutComponent} from './logout/logout.component';
import { LoginComponent} from './login/login.component';
import { SignupComponent} from './signup/signup.component';
import { IFrameComponent} from './iframe/iframe.component';
import { KeyVaultComponent } from './keyvault/keyvault.component';
import { AuthGroupsComponent } from './authgroups/authgroups.component';
import { CRUDComponent } from './crud/crud.component';
import { ConfirmDialog } from './dialogs/confirm.dialog';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG , PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};


@NgModule({
    declarations: [
        SidemenuComponent,
        SidemenuItemComponent,
        ToolbarNotificationComponent,
        ToolbarCartComponent,
        ToolbarComponent,
        SearchBarComponent,
        FullscreenComponent,
        SidebarComponent,
        UserMenuComponent,
        LogoutComponent,
        LoginComponent,
        SignupComponent,
        IFrameComponent,
        CRUDComponent,
        ConfirmDialog,
        KeyVaultComponent,
        AuthGroupsComponent
    ],
    imports: [
        NgxDatatableModule,
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
        RouterModule,
        MatSelectModule,
        PerfectScrollbarModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatTabsModule,
        MatSliderModule,
        MatProgressBarModule,
        NgxDoPipesModule,
    ],
    exports: [
        SidemenuComponent,
        SidemenuItemComponent,
        ToolbarNotificationComponent,
        ToolbarCartComponent,
        ToolbarComponent,
        SearchBarComponent,
        FullscreenComponent,
        SidebarComponent,
        UserMenuComponent,
        IFrameComponent,
        CRUDComponent,
        ConfirmDialog,
        KeyVaultComponent,
        AuthGroupsComponent
    ],
    entryComponents : [
     ConfirmDialog,
    ],

    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class NgxDoUiModule {}
