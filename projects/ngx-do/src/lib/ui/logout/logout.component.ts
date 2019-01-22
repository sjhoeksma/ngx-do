import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreAuth } from '../../core/core.auth';

@Component({
  template: ''
})

export class LogoutComponent implements OnInit {

  constructor(
    private coreAuth: CoreAuth ,
    private activatedRoute: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
       this.coreAuth.logout(params['byUser'] === 'true').then(ret => {
        this.router.navigate(['/login']);
      });
    });
  }

}
