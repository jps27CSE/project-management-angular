import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [AutoCompleteModule, NgForOf, ReactiveFormsModule, NgIf],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  @Input() projectId?: number;
  selectedItems: any[] = [];
  items: any[] = []; // Array for autocomplete suggestions
  maxMembers = 5; // Maximum number of members

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
      projectMemberUsernames: this.fb.array([]), // Initialize as FormArray
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

  get projectMemberUsernames(): FormArray {
    return this.addProjectForm.get('projectMemberUsernames') as FormArray;
  }

  addMember() {
    if (this.projectMemberUsernames.length < this.maxMembers) {
      this.projectMemberUsernames.push(new FormControl('')); // Add empty FormControl
    }
  }

  removeMember(index: number) {
    this.projectMemberUsernames.removeAt(index); // Remove FormControl at index
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

      const projectMembersArray = this.projectMemberUsernames;
      projectMembersArray.clear(); // Clear existing controls

      project.projectMemberUsernames.forEach((username: string) => {
        projectMembersArray.push(new FormControl(username)); // Add FormControl for each username
      });
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
        projectMemberUsernames: formData.projectMemberUsernames, // Use form data directly
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
