import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { DateFormatPipe } from '../dashboard/date-format.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [NgIf, DateFormatPipe],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent {
  @Input() project: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  deleteProject() {
    if (this.project?.id) {
      this.authService.deleteProject(this.project.id).subscribe(
        () => {
          console.log('Project deleted successfully');
          // Optionally refresh the list or navigate away
          this.router.navigate(['']); // Navigate to a different route after deletion
        },
        (error) => {
          console.error('Error deleting project:', error);
        },
      );
    } else {
      console.error('Project ID is not defined.');
    }
  }
}
