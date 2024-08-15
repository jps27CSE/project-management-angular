import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { format } from 'date-fns';
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
  projectId?: number;
  maxMembers = 5;

  statusMapping: { [key: number]: string } = {
    1: 'START',
    2: 'PRE',
    3: 'END',
  };

  reverseStatusMapping: { [key: string]: number } = {
    START: 1,
    PRE: 2,
    END: 3,
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.addProjectForm = this.fb.group({
      name: ['', [Validators.required]],
      intro: ['', [Validators.required]],
      status: [null, [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      projectMemberUsernames: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectId = +id;
        this.loadProjectDetails(this.projectId);
      }
    });
  }

  get projectMemberUsernames(): FormArray {
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

      const filteredMemberUsernames = formData.projectMemberUsernames.filter(
        (username: string) => username.trim() !== '',
      );

      // Map the status string to its corresponding numeric value
      const statusValue = this.reverseStatusMapping[formData.status];

      const data = {
        name: formData.name,
        intro: formData.intro,
        status: statusValue, // Use the numeric status value
        startDate: formData.startDate
          ? format(new Date(formData.startDate), 'yyyy-MM-dd')
          : null,
        endDate: formData.endDate
          ? format(new Date(formData.endDate), 'yyyy-MM-dd')
          : null,
        projectMemberUsernames: filteredMemberUsernames,
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

  private loadProjectDetails(id: number) {
    this.authService.getProject(id).subscribe((project) => {
      this.addProjectForm.patchValue({
        name: project.name,
        intro: project.intro,
        status: this.getStatusString(project.status), // Convert the enum number to string for the form
        startDate: project.startDate,
        endDate: project.endDate,
      });

      this.projectMemberUsernames.clear();
      project.projectMemberUsernames.forEach((username: string) => {
        this.projectMemberUsernames.push(this.fb.control(username));
      });
    });
  }

  // Convert enum number to its corresponding string value for the form
  private getStatusString(status: number): string {
    return this.statusMapping[status] || 'START';
  }
}
