import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/shared/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.callDashboardAPI();
  }

  callDashboardAPI() {
    this.loginService.dashboard().subscribe(res => {
      console.log('res', res);
    }, error => {
      console.log('error', error);
    });
  }

  logout() {
    this.loginService.logout().subscribe(res => {

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      this.router.navigate(["login"]);

    }, error => {

    });
  }

}
