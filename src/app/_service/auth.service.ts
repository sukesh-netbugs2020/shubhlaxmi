import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    public baseUrl: string = environment.apiUrl;
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
      console.log("In User Service");
     
      return this.http.post<any>(this.baseUrl+`user/login`, { username, password })
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
              console.log(user)
              // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
              user.data.authdata = window.btoa('admin:1234');
              user.data.message = user.message;
              user.data.success = user.success;
              localStorage.setItem('currentUser', JSON.stringify(user.data));
              this.currentUserSubject.next(user.data);
              return user.data;
          }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
