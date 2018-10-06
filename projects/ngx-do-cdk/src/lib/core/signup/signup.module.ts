import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { RouterModule, Routes } from '@angular/router'; 
import { 
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatOptionModule,
        MatCheckboxModule,
        MatSelectModule,
        MatToolbarModule
       } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { WidgetsModule } from '../../widgets/widgets.module';

const signupRoutes: Routes = [
    { path: '', component: SignupComponent },
]

@NgModule({
  imports: [
    MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        FormsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatOptionModule,
        ReactiveFormsModule,
        WidgetsModule,
        RouterModule.forChild(signupRoutes)
  ],
  declarations: [
    SignupComponent
  ],
  exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class SignupModule { }
