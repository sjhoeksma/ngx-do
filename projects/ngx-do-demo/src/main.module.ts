import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CoreModule,CoreGlobalModule,DoModule,
        LoginModule,SignupModule, DoComponent,CoreAuth } from 'ngx-do-cdk';
import { RestangularModule, Restangular } from 'ngx-restangular';

// Function for setting the default restangular configuration
export function RestangularConfigFactory (RestangularProvider) {
}

//Default routes the app always implements
const RootRoutes: Routes = [   
    {path: 'app', loadChildren: './app/app.module#AppModule',canActivate:[CoreAuth] },
    {path: 'login', loadChildren: ()=>LoginModule},
    {path: 'logout', redirectTo: 'login'},
    {path: 'signup', loadChildren: ()=>SignupModule },
    {path: 'register', redirectTo: 'signup'},
    {path:'error',redirectTo:'app/error'}, //Error Route
    {path: '**', redirectTo: 'app'},
]

//The main module loads the Do and CoreGlobal modules
@NgModule({
  imports: [
    DoModule,
    CoreGlobalModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    RouterModule.forRoot(RootRoutes),
  ],
  bootstrap: [
    DoComponent
  ]
})
export class MainModule {}
