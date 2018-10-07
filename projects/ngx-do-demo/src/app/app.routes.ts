import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CoreAuth } from 'ngx-do-cdk';


export const AppRoutes: Routes = [{
  path: '', component: AppComponent, children: [
    { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'}, //Dashboard

    { path: 'pages', loadChildren: './pages/pages.module#PagesModule' },  //Common pages
    {path:'error',redirectTo:'pages/error'}, //Error Route
    {path:'',redirectTo:'dashboard', pathMatch: 'full'}, //We show by default the dashboard
   ]}
];
