import { Component, OnInit, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfig } from '../core.config'
import { CoreAuth } from '../core.auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;
  shake: boolean = false;
  formErrors = {
    'email': '',
    'password': '',
    'remember' :''
  };
  validationMessages = {
    'email': {
      'required': 'Please enter your email',
      'email': 'please enter your vaild email'
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    },
    'remember': {}
  };

  constructor(private fb: FormBuilder,
              public coreConfig: CoreConfig,
              private router : Router,
              private activatedRoute: ActivatedRoute, 
              private coreAuth: CoreAuth) {
  }

  ngOnInit() {
     this.backendChange(null); //Check if can re login
     this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.maxLength(this.coreConfig.backendValue('passwordMax',25))
      ]
      ],
      'remember': [this.coreConfig.remember]
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
  
  login() {
    this.coreAuth.login(this.userForm.get('email').value,
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
  backendChange(backend:any){
    if (this.coreConfig.backendValue('silentLogin',false)==true){
      this.coreAuth.refreshToken().then(token=>{
        if (token) {
          this.activatedRoute.queryParams.subscribe(params => {
             this.router.navigate([params['requestedUrl'] || '/app']);
          });
        } 
      })
    }
  }

}

