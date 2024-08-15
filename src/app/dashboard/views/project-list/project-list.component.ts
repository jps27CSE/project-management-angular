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
      const confirmation = window.confirm(
        'Are you sure you want to delete this project? This action cannot be undone.',
      );

      if (confirmation) {
        this.authService.deleteProject(this.project.id).subscribe(
          () => {
            console.log('Project deleted successfully', this.project.id);
            this.delete.emit(this.project.id);
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
