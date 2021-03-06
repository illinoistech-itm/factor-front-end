import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../globals/helpers/http.service';
import { ModelsComponent, User } from '../../../globals/models/models.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  languages = [];
  loading = false;
  error = false;

  constructor(private _httpService: HttpService, private router: Router,
              private formBuilder: FormBuilder, @Inject(LOCALE_ID) public localeId: string) {
    for (let i = 0; i < ModelsComponent.languages.length; i++) {
      this.languages[i] = ModelsComponent.languages[i];
    }
    // redirect to home if already logged in
    const user = this._httpService.currentUserValue;
    if (user) {
      if (user.authlvl === 127) {
        this.router.navigate(['mockcourses']);
      } else if (user.authlvl >= 63) {
        this.router.navigate(['professor']);
      } else if (user.authlvl >= 31) {
        this.router.navigate(['student']);
      } else if (user.authlvl >= 1) {
        this.router.navigate(['student']);
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // pattern('')
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() { return this.loginForm.controls; }

  verifyUser() {
      this.submitted = true;

      // stop the process here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
      this.loading = true;
      this._httpService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).subscribe((data: User) => {
        this.loading = false;
        if (data.authlvl === 127) {
              this.router.navigate(['mockcourses']);
          } else if (data.authlvl >= 63) {
              this.router.navigate(['professor']);
          } else if (data.authlvl >= 31) {
              this.router.navigate(['student']);
          } else if (data.authlvl >= 1) {
              this.router.navigate(['student']);
          } else if (data.authlvl >= 0) {
              this._httpService.getOauth().subscribe((url: string) => {
                localStorage.setItem('pass', this.loginForm.get('password').value);
                window.location.replace(url);
              }, (error: any) => {console.log(error); });
          } else if (data.authlvl <= -1) {
              // show error contraseña mal introducida
              console.log('review pass show alert');
          }
      }, (error: any) => {
        console.log(error);
        this.error = true;
      });
  }

  // ToDo DELETE _____ Ask the API to change the password
  forgotPasswordForm() {
  }

}
