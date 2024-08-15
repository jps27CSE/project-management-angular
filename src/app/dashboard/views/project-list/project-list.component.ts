import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() delete = new EventEmitter<number>(); // Emit project ID on delete

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
          (response) => {
            console.log('Project deleted successfully:', response);
            this.delete.emit(this.project.id); // Emit project ID on successful deletion
            window.location.reload(); // Refresh the page
          },
          (error) => {
            // Improve error handling and logging
            console.error('Error deleting project:', error);
            if (error.status === 500) {
              window.alert(
                'You are not the owner of this project or an internal server error occurred.',
              );
            } else if (error.status === 403) {
              window.alert('You are not authorized to delete this project.');
            } else {
              window.alert(
                'An unexpected error occurred. Please try again later.',
              );
            }
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
