import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginApi = 'http://localhost:8080/auth/login';

  private registerApi = 'http://localhost:8080/auth/register';
  constructor(private http: HttpClient) {}

  loginUser(data: any): Observable<any> {
    return this.http.post(this.loginApi, data, { responseType: 'text' });
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(this.registerApi, data, { responseType: 'text' });
  }
}
