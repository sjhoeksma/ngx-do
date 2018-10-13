import { Component, OnInit, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfig } from '../core.config'
import { CoreAuth } from '../core.auth'

export class RegistrationValidator {
  static validate(registrationFormGroup: FormGroup) {
    let password = registrationFormGroup.controls.password.value;
    let repeatPassword = registrationFormGroup.controls.password2.value;
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

  constructor(private fb: FormBuilder,
              public coreConfig: CoreConfig,
              private router : Router,
              private activatedRoute: ActivatedRoute, 
              private coreAuth: CoreAuth) { }

  userForm: FormGroup;
  shake:boolean = false;
  formErrors = {
    'email': '',
    'password': '',
    'password2': '',
    'remember': ''
  };
  validationMessages = {
    'email': {
      'required': 'Please enter your email',
      'email': 'please enter your vaild email'
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers, letters and special character',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    },
    'password2': {
      'required': 'please re-enter your password',
      'pattern': 'The password must contain numbers, letters and special character',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    },
    'remember':{}
  };
  
  
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
        Validators.minLength(this.coreConfig.backendValue('passwordMin',6)),
        Validators.maxLength(this.coreConfig.backendValue('passwordMax',25))
      ]
      ],
      'password2': ['', [
        Validators.pattern(this.coreConfig.backendValue('passwordPattern')),
        Validators.minLength(this.coreConfig.backendValue('passwordMin',6)),
        Validators.maxLength(this.coreConfig.backendValue('passwordMax',25))
      ]
      ],
      'remember' : [this.coreConfig.remember]
    },  {
      validator: RegistrationValidator.validate.bind(this)
    });
    
    //this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    //this.onValueChanged();
  }

  onValueChanged(data?: any) {
     if (!this.userForm) {
       return;
     }
     const form = this.userForm;
     for (const field in this.formErrors) {
       if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
         this.formErrors[field] = '';
         const control = form.get(field);
         if (control && control.dirty && !control.valid) {
           const messages = this.validationMessages[field];
           for (const key in control.errors) {
             if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
               this.formErrors[field] += messages[key] + ' ';
             }
           }
         }
       }
     }
  }
  
  backendAllowed(item:object):boolean{
    return item['signup']!==false; 
  }
  
  signup() {
    this.coreAuth.signup(this.userForm.get('email').value,
                         this.userForm.get('password').value,
                         this.userForm.get('remember').value)
      .then((res)=>{
        if (res) {
          this.activatedRoute.queryParams.subscribe(params => {
             this.router.navigate([params['requestedUrl'] || '/app']);
          });
        } else {
          this.shake=true;
          setTimeout(()=>{this.shake=false},500);
        }
      });
  }
  
  //Change event of backend type
  backendChange(event:any){
    
  }

}
