import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';

import { ProfileComponent } from './profile/profile.component';
import { KeyVaultComponent } from './keyvault/keyvault.component'

import { CoreAuth } from 'ngx-do-cdk';

const pagesRoutes: Routes = [
    //These are public sides
  	{ path: 'about', component: AboutComponent ,data: { animation: 'about' }},
    { path: 'error', component: ErrorComponent ,data: { animation: 'error' }},
    { path: 'contact', component: ContactComponent ,data: { animation: 'contact' },
      canActivate:[CoreAuth]
    },
    { path: 'profile', component: ProfileComponent ,data: { animation: 'profile' },
      canActivate:[CoreAuth]
    },
    { path: 'profile/:id', component: ProfileComponent ,data: { animation: 'profile'}
      ,canActivate:[CoreAuth]
    },
    { path: 'keyvault', component: KeyVaultComponent ,data: { animation: 'keyvault' },
      canActivate:[CoreAuth]
    },
];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  	],
  exports: [
    RouterModule
  ]
})
export class PagesRouterModule {}