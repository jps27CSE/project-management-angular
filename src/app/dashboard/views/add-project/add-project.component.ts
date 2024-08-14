import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  @Input() projectId?: number;
  readonly maxMembers = 5;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.addProjectForm = this.fb.group({
      name: ['', [Validators.required]],
      intro: ['', [Validators.required]],
      status: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      startDateTime: ['', [Validators.required]],
      endDateTime: ['', [Validators.required]],
      projectMemberUsernames: this.fb.array(
        [this.fb.control('')],
        Validators.required,
      ),
    });
  }

  get projectMemberUsernames() {
    return this.addProjectForm.get('projectMemberUsernames') as FormArray;
  }

  addMember() {
    if (this.projectMemberUsernames.length < this.maxMembers) {
      this.projectMemberUsernames.push(this.fb.control(''));
    }
  }

  removeMember(index: number) {
    this.projectMemberUsernames.removeAt(index);
  }

  onSubmit() {
    if (this.addProjectForm.valid) {
      const formData = this.addProjectForm.value;

      // Filter out any blank member fields
      const filteredMemberUsernames = formData.projectMemberUsernames.filter(
        (username: string) => username.trim() !== '',
      );

      const data = {
        name: formData.name,
        intro: formData.intro,
        status: formData.status,
        startDate: format(new Date(formData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(formData.endDate), 'yyyy-MM-dd'),
        projectMemberUsernames: filteredMemberUsernames,
      };

      if (this.projectId !== undefined) {
        // Handle update logic if needed
      } else {
        this.authService.addProject(data).subscribe(
          () => {
            console.log('Project created successfully');
            this.router.navigate(['']);
          },
          (error) => {
            console.error('Error creating project:', error);
          },
        );
      }
    }
  }

  deleteProject() {
    if (this.projectId !== undefined) {
      this.authService.deleteProject(this.projectId).subscribe(
        () => {
          console.log('Project deleted successfully');
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

  ngOnInit() {
    // Check if there's a project ID in the route to determine if it's edit mode
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectId = +id;
        // Optionally load the project details and populate the form
      }
    });
  }
}
