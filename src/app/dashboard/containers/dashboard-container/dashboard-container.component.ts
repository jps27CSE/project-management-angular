import { Component } from '@angular/core';
import { DashboardComponent } from '../../views/dashboard/dashboard.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [DashboardComponent, RouterLink],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.css',
})
export class DashboardContainerComponent {}
