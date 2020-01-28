import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  SERVER_URL = environment.serverUrl;  

  constructor(private http: HttpClient) { }

    /* This function is used for login*/
    login(email, password){
      return this.http.post(this.SERVER_URL + '/login', {
        "email": email,
        "password": password
      });
    }

    /* This function is used for logout */
    logout() {
      return this.http.post(this.SERVER_URL + '/logout', {
        "refreshToken": localStorage.getItem('refreshToken')
      });
    }

    /* */
    refreshToken() {
      return this.http.post(this.SERVER_URL + '/refresh-token', {
        "refreshToken": localStorage.getItem('refreshToken')
      });
    }

    /* */
    dashboard() {
      return this.http.get(this.SERVER_URL + '/dashboard')
    }

}
