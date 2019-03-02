import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfig } from '../../core/core.config';
import { CoreAuth } from '../../core/core.auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userForm: FormGroup;
  public backendList : Array<string> = [];
  public shake: boolean = false;

  constructor(private fb: FormBuilder,
              public coreConfig: CoreConfig,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private coreAuth: CoreAuth) {
    // Filter available backends
    this.coreConfig.backendList.forEach(backend => {
      if (this.coreAuth.authServiceEnabled(backend.type)) {
          this.backendList.push(backend);
      }
    });
  }

  ngOnInit() {
     this.backendChange(null); // Check if can re login
     this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.maxLength(this.coreConfig.backendValue('passwordMax', 25))
      ]
      ],
      'remember': [this.coreConfig.remember]
    });
  }

  login() {
    this.coreAuth.login(this.userForm.get('email').value,
                        this.userForm.get('password').value,
                        this.userForm.get('remember').value)
      .then((res) => {
        if (res) {
          this.activatedRoute.queryParams.subscribe(params => {
             this.router.navigate([params['requestedUrl'] || '/app']);
          });
        } else {
          this.shake = true;
          setTimeout(() => {this.shake = false; }, 500);
        }
      });
  }

    // Change event of backend type
  backendChange(backend: any) {
    if (this.coreConfig.backendValue('silentLogin', false) === true) {
      this.coreAuth.refreshToken().then(token => {
        if (token) {
          this.activatedRoute.queryParams.subscribe(params => {
             this.router.navigate([params['requestedUrl'] || '/app']);
          });
        }
      });
    }
  }

}

