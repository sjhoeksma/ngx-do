import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { SidemenuItemComponent } from './sidemenu-item/sidemenu-item.component';
import { MatCardModule , MatListModule , MatButtonModule ,MatInputModule ,MatIconModule, MatToolbarModule , MatChipsModule ,MatFormFieldModule, MatTabsModule, MatOptionModule,  MatSidenavModule, MatSliderModule, MatProgressBarModule, MatSelectModule, MatButtonToggleModule,MatCheckboxModule,MatSnackBarModule} from '@angular/material';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG , PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolbarNotificationComponent } from './toolbar-notification/toolbar-notification.component';
import { ToolbarCartComponent } from './toolbar-cart/toolbar-cart.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { LogoutComponent} from './logout/logout.component';
import { LoginComponent} from './login/login.component';
import { SignupComponent} from './signup/signup.component';



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
        SignupComponent
    ],

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
        WidgetsModule,
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
    ],

    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]   
})
export class CoreModule {}
