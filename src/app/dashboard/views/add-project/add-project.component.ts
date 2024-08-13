import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [FormsModule, NgForOf, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
})
export class AddProjectComponent {
  addProjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.addProjectForm = this.fb.group({
      name: ['', [Validators.required]],
      intro: ['', [Validators.required]],
      status: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      projectMemberUserNames: this.fb.array(
        [this.fb.control('')],
        Validators.required,
      ),
    });
  }

  get projectMemberUserNames() {
    return this.addProjectForm.get('projectMemberUserNames') as FormArray;
  }

  addMember() {
    this.projectMemberUserNames.push(this.fb.control(''));
  }

  removeMember(index: number) {
    this.projectMemberUserNames.removeAt(index);
  }

  onSubmit() {
    if (this.addProjectForm.valid) {
      const formData = this.addProjectForm.value;
      this.authService.addProject(formData).subscribe(
        (response) => {
          console.log('Project created successfully:', response);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error creating project:', error);
        },
      );
    }
  }
}
