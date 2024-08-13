import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProjectListComponent } from '../project-list/project-list.component';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProjectListComponent, NgForOf, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
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
    // Set the default start and end date to today's date with time
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}
