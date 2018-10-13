import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent,SignupComponent,LogoutComponent} from 'ngx-do-cdk';

export const AppRoutes: Routes = [{
  path: 'app', component: AppComponent, children: [
    { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'}, //Dashboard

    { path: 'pages', loadChildren: './pages/pages.module#PagesModule' },  //Common pages
    { path: 'material-widgets', loadChildren: './material-widgets/material-widgets.module#MaterialWidgetsModule' },  
    {path:'error',redirectTo:'pages/error'}, //Error Route
    {path:'',redirectTo:'dashboard', pathMatch: 'full'}, //We show by default the dashboard
   ],
 },
  {path: 'login', component: LoginComponent },
  {path: 'logout', component: LogoutComponent},
  {path: 'signup', component: SignupComponent },
  {path: 'register', redirectTo: 'signup'},
  {path:'error',redirectTo:'/app/error'}, //Error Route
  {path: '**', redirectTo: '/app'},
];
