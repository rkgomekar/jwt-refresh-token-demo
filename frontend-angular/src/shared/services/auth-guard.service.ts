import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private router: Router) {}  

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
     
    let token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }


}
