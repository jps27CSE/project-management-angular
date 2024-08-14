import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [AutoCompleteModule, NgForOf, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  @Input() projectId?: number;
  items: any[] = []; // Array for autocomplete suggestions

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
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      projectMemberUsernames: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectId = +id;
        this.loadProjectDetails(this.projectId); // Load project details if in edit mode
      }
    });
  }

  loadProjectDetails(id: number) {
    this.authService.getProject(id).subscribe((project) => {
      this.addProjectForm.patchValue({
        name: project.name,
        intro: project.intro,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
      });
      this.addProjectForm.controls['projectMemberUsernames'].setValue(
        project.projectMemberUsernames.map((username: any) => ({
          name: username,
        })),
      );
    });
  }

  search(event: AutoCompleteCompleteEvent) {
    this.authService.getUsernames().subscribe((usernames) => {
      this.items = usernames.map((username) => ({ name: username }));
    });
  }

  onSubmit() {
    if (this.addProjectForm.valid) {
      const formData = this.addProjectForm.value;

      const data = {
        name: formData.name,
        intro: formData.intro,
        status: String(formData.status), // Convert status to string to match API format
        startDate: formData.startDate
          ? format(new Date(formData.startDate), 'yyyy-MM-dd')
          : null,
        endDate: formData.endDate
          ? format(new Date(formData.endDate), 'yyyy-MM-dd')
          : null,
        projectMemberUsernames: formData.projectMemberUsernames.map(
          (item: any) => item.name,
        ),
      };

      if (this.projectId !== undefined) {
        this.authService.updateProject(this.projectId, data).subscribe(
          () => {
            console.log('Project updated successfully');
            this.router.navigate(['']);
          },
          (error) => {
            console.error('Error updating project:', error);
          },
        );
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
}
