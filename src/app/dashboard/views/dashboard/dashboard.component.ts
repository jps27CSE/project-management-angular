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
  startDate?: string;
  endDate?: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Set the default start and end date to today's date
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    this.startDate = currentDate;
    this.endDate = currentDate;

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
      this.startDate = selectedDate;
    } else {
      this.endDate = selectedDate;
    }
    this.fetchProjects(this.startDate!, this.endDate!);
  }
}
