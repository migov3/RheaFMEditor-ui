import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public baseUrl = 'http://localhost:5000';
  public currentUser: any;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
  }

  public get baseUrlValue() {
    return this.baseUrl;
  }

  expiredRefToken() {
    const token = localStorage.getItem('refresh_token');
    return this.jwtHelper.isTokenExpired(token);
  }

  getRole() {
    const token = localStorage.getItem('access_token');
    return token ? this.jwtHelper.decodeToken(token).sub.role_id : 3;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  register(user: any) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/repository']);
  }

  private getRefreshHeaders() {
    const refToken = localStorage.getItem('refresh_token');
    return new HttpHeaders().set('Authorization', `Bearer ${refToken}`);
  }

  refreshToken() {
    return this.http.post<any>(`${this.baseUrl}/refresh`, "", { headers: this.getRefreshHeaders() });
  }
}
