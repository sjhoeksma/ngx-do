import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { 
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatInputModule,
        MatToolbarModule,
        MatOptionModule,
        MatSelectModule,
       } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

const loginRoutes: Routes = [
    {path: '', component: LoginComponent},
  ];
@NgModule({
    imports: [
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatCheckboxModule,
        MatToolbarModule,
        FormsModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        RouterModule.forChild(loginRoutes)
    ],
    declarations: [   
        LoginComponent,
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class LoginModule {
}
