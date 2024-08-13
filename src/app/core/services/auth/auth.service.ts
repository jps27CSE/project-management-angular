import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private addProjectApi = 'http://localhost:8080/api/v1/projects/create';
  private listProjectsApi = 'http://localhost:8080/api/v1/projects/list';

  constructor(private http: HttpClient) {}

  loginUser(data: any): Observable<any> {
    return this.http.post(this.loginApi, data, { responseType: 'text' });
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(this.registerApi, data, { responseType: 'text' });
  }

  addProject(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.addProjectApi, data, { headers });
  }

  getProjects(start: string, end: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(
      `${this.listProjectsApi}?start=${start}&end=${end}`,
      { headers },
    );
  }
}
