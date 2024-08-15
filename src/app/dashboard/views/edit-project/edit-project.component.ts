import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { format } from 'date-fns';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgForOf, NgIf],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  editProjectForm: FormGroup;
  projectId!: number;
  maxMembers = 5;

  statusMapping: { [key: number]: string } = {
    1: 'START',
    2: 'PRE',
    3: 'END',
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.editProjectForm = this.fb.group({
      name: ['', [Validators.required]],
      intro: ['', [Validators.required]],
      status: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      projectMemberUsernames: this.fb.array([], Validators.required),
    });
  }

  get projectMemberUsernames() {
    return this.editProjectForm.get('projectMemberUsernames') as FormArray;
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
    const confirmation = window.confirm(
      'Are you sure you want to save the changes to this project?',
    );

    if (confirmation) {
      if (this.editProjectForm.valid) {
        const formData = this.editProjectForm.value;

        const filteredMemberUsernames = formData.projectMemberUsernames.filter(
          (username: string) => username.trim() !== '',
        );

        // Map the numeric status value to the corresponding enum string
        const statusEnum = this.statusMapping[formData.status];

        const data = {
          name: formData.name,
          intro: formData.intro,
          status: statusEnum, // Use the enum string value here
          startDate: formData.startDate
            ? format(new Date(formData.startDate), 'yyyy-MM-dd')
            : null,
          endDate: formData.endDate
            ? format(new Date(formData.endDate), 'yyyy-MM-dd')
            : null,
          projectMemberUsernames: filteredMemberUsernames,
        };

        this.authService.updateProject(this.projectId, data).subscribe(
          () => {
            console.log('Project updated successfully');
            this.router.navigate(['']);
          },
          (error) => {
            console.error('Error updating project:', error);
          },
        );
      }
    } else {
      console.log('Project update canceled by the user.');
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.projectId = +params.get('id')!;
      this.loadProjectData();
    });
  }

  private loadProjectData() {
    this.authService.getProject(this.projectId).subscribe((project) => {
      this.editProjectForm.patchValue({
        name: project.name,
        intro: project.intro,
        status: this.getStatusKey(project.status), // Convert the enum string back to a number for the form
        startDate: project.startDate,
        endDate: project.endDate,
      });
      this.projectMemberUsernames.clear();
      project.projectMemberUsernames.forEach((username: any) => {
        this.projectMemberUsernames.push(this.fb.control(username));
      });
    });
  }

  // Convert enum string back to its corresponding numeric value for the form
  private getStatusKey(status: string): number {
    return parseInt(
      Object.keys(this.statusMapping).find(
        (key) => this.statusMapping[+key] === status,
      ) || '1',
      10,
    );
  }
}
