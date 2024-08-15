import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

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
  private deleteProjectApi = 'http://localhost:8080/api/v1/projects/delete';
  private getProjectApi = 'http://localhost:8080/api/v1/projects/get';
  private updateProjectApi = 'http://localhost:8080/api/v1/projects/edit';
  private getUsernamesApi = 'http://localhost:8080/api/users/usernames'; // New API endpoint

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

  deleteProject(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .delete(this.deleteProjectApi + `/${id}`, {
        headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          // Handle JSON response if needed
          if (response.body) {
            return response.body;
          }
          return {}; // Return empty object if no body
        }),
        catchError((error) => {
          console.error('Error deleting project:', error);
          return throwError('An error occurred; please try again later.');
        }),
      );
  }

  getProject(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.getProjectApi}/${id}`, { headers });
  }

  updateProject(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.updateProjectApi}/${id}`, data, { headers });
  }

  getUsernames(): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<string[]>(this.getUsernamesApi, { headers });
  }
}
