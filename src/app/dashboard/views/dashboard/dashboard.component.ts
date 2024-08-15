import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProjectListComponent } from '../project-list/project-list.component';
import { NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DateFormatPipe } from './date-format.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProjectListComponent, NgForOf, NgIf, DateFormatPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  startDate: string = '';
  endDate: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Set the default start and end date to today's date
    const currentDate = new Date();
    this.startDate = this.formatDate(currentDate);
    this.endDate = this.formatDate(currentDate);

    // Check if the token exists in local storage
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.fetchProjects(this.startDate, this.endDate);
  }

  logout() {
    // Remove the token from local storage
    localStorage.removeItem('token');

    // Redirect to the login page under the correct path
    this.router.navigate(['/auth/login']);
  }

  // Fetch projects based on the selected date range
  fetchProjects(startDate: string, endDate: string) {
    this.authService.getProjects(startDate, endDate).subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      },
    );
  }

  // Handle date changes
  onDateChange(type: 'start' | 'end', event: any) {
    const selectedDate = event.target.value;
    if (type === 'start') {
      this.startDate = this.formatDate(new Date(selectedDate));
    } else {
      this.endDate = this.formatDate(new Date(selectedDate));
    }
    this.fetchProjects(this.startDate, this.endDate);
  }

  // Format date to YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Handle project deletion
  handleProjectDeletion(projectId: number) {
    this.projects = this.projects.filter((project) => project.id !== projectId);
    console.log(projectId, 'in handle');
    this.authService.deleteProject(projectId).subscribe(
      () => {
        // Remove the deleted project from the array
        this.projects = this.projects.filter(
          (project) => project.id !== projectId,
        );
      },
      (error) => {
        if (error.status === 500) {
          window.alert(
            'You are not the owner of this project or an internal server error occurred.',
          );
        }
        console.error('Error deleting project:', error);
      },
    );
  }
}
