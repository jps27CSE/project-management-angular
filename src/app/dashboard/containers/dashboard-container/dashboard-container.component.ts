import { Component } from '@angular/core';
import { DashboardComponent } from '../../views/dashboard/dashboard.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [DashboardComponent, RouterLink],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.css',
})
export class DashboardContainerComponent {
  // constructor(private router: Router) {}
  //
  // logout() {
  //   // Remove the token from local storage
  //   localStorage.removeItem('token');
  //
  //   // Redirect to the login page under the correct path
  //   this.router.navigate(['/auth/login']);
  // }
}
