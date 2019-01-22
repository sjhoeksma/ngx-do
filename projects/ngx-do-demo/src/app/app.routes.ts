import { NgModule }              from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CorePreloadingStrategy,
        CoreAuth,
        LoginComponent,
        SignupComponent,
        LogoutComponent
       } from 'ngx-do';
import { pagesRoutes} from 'ngx-do-pages';

/**
 There is a problem with Angular not allowing to lazyload modules from libraries
 Therefor we included PagesModule and pagesRoutes from ngx
 You can use the lazyload but then heeft to disable --aot == ng serve --aot
*/ 

export const appRoutes: Routes = [{
  path: 'app', component: AppComponent, children: [
    { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'}, // Dashboard

   //{ path: 'pages', loadChildren: 'ngx-do-cdk#PagesModule' },  // lazyloading of Common pages, require --aot
    { path: 'pages', children: pagesRoutes },  // Work Account for lazyloading Common pages
    
    { path: 'material-widgets', loadChildren: './material-widgets/material-widgets.module#MaterialWidgetsModule',
     data: { preload: true, delay: false }},
    { path: 'widgets', loadChildren: './do-widgets/do-widgets.module#DoWidgetsModule' },  // Common pages
    {path: 'error', redirectTo: 'pages/error'}, // Error Route
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'}, // We show by default the dashboard
   ], canActivate: [CoreAuth]
  },
  {path: 'login', component: LoginComponent },
  {path: 'logout', component: LogoutComponent},
  {path: 'signup', component: SignupComponent },
  {path: 'register', redirectTo: 'signup'},
  {path: 'error', redirectTo: '/app/error'}, // Error Route
  {path: '**', redirectTo: '/app'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {preloadingStrategy: CorePreloadingStrategy}
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule {}
