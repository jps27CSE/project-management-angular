import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { DateFormatPipe } from '../dashboard/date-format.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [DateFormatPipe, NgIf, NgForOf],
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
      // Confirm deletion with a popup
      const confirmation = window.confirm(
        'Are you sure you want to delete this project? This action cannot be undone.',
      );

      if (confirmation) {
        this.authService.deleteProject(this.project.id).subscribe(
          () => {
            console.log('Project deleted successfully');
            this.router.navigate(['']);
          },
          (error) => {
            window.confirm('You are not owner of this project');
            console.error('Error deleting project:', error);
          },
        );
      }
    } else {
      console.error('Project ID is not defined.');
    }
  }

  editProject() {
    if (this.project?.id) {
      this.router.navigate([`/edit/${this.project.id}`]);
    } else {
      console.error('Project ID is not defined.');
    }
  }
}
