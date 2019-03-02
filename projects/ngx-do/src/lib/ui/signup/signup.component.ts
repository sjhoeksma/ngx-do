import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfig } from '../../core/core.config';
import { CoreAuth } from '../../core/core.auth';

export class RegistrationValidator {
  static validate(registrationFormGroup: FormGroup) {
    const password = registrationFormGroup.controls.password.value;
    const repeatPassword = registrationFormGroup.controls.password2.value;
    if (repeatPassword.length <= 0) {
        return null;
    }
    if (repeatPassword !== password) {
        return {
            doesMatchPassword: true
        };
    }
    return null;
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  backendList = [];
  constructor(private fb: FormBuilder,
              public coreConfig: CoreConfig,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private coreAuth: CoreAuth) {
      this.coreConfig.backendList.forEach(backend => {
      if (this.coreAuth.authServiceEnabled(backend.type)) {
          this.backendList.push(backend);
      }
    });
  }

  userForm: FormGroup;
  shake = false;

  ngOnInit() {
    this.coreAuth.logout(true);
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern(this.coreConfig.backendValue('passwordPattern')),
        Validators.minLength(this.coreConfig.backendValue('passwordMin', 6)),
        Validators.maxLength(this.coreConfig.backendValue('passwordMax', 25))
      ]
      ],
      'password2': ['', [
        Validators.pattern(this.coreConfig.backendValue('passwordPattern')),
        Validators.minLength(this.coreConfig.backendValue('passwordMin', 6)),
        Validators.maxLength(this.coreConfig.backendValue('passwordMax', 25))
      ]
      ],
      'remember' : [this.coreConfig.remember]
    },  {
      validator: RegistrationValidator.validate.bind(this)
    });
  }

  backendAllowed(item: object): boolean {
    return item['signup'] !== false;
  }

  signup() {
    this.coreAuth.signup(this.userForm.get('email').value,
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

  //Signup will not do anything onbackend change
  backendChange(backend: any) {
   
  }

}
