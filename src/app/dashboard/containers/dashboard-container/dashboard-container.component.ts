import { Component } from '@angular/core';
import { DashboardComponent } from '../../views/dashboard/dashboard.component';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.css',
})
export class DashboardContainerComponent {}
