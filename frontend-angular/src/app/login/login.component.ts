import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/shared/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private loginService: LoginService, 
    private router: Router) { }

  ngOnInit() {
    this.createLoginform();
  }

  /* This function is used to create the Login Form and validation*/
  createLoginform() {
    this.loginForm = this.fb.group({
      email: ['rkgomekar@gmail.com',
        [
          Validators.required,
          Validators.pattern(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/),

        ]],
      password: ['12345', [
        Validators.required
        //  ,Validators.pattern(/^.{6,18}$/),
      ]],
    });
  }

  onSubmit(value) {
    this.loginService.login(value.email, value.password).subscribe(res => {
      localStorage.setItem('token', res['token']);
      localStorage.setItem('refreshToken', res['refreshToken']);
      this.router.navigate(['']);
    }, error => {
    });
  }

}
