import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()

// @Injectable({
//   providedIn: 'root'
// })
export class IsLoggedIn {

  constructor(private router: Router) { }

  resolve(): void {
    let token = localStorage.getItem('token');
    if (token){
       this.router.navigate(['/'])
  }
}
}
