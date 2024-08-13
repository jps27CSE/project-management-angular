import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
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
    this.projectMemberUsernames.push(this.fb.control(''));
  }

  removeMember(index: number) {
    this.projectMemberUsernames.removeAt(index);
  }

  onSubmit() {
    if (this.addProjectForm.valid) {
      const formData = this.addProjectForm.value;
      const data = {
        name: formData.name,
        intro: formData.intro,
        status: formData.status,
        startDateTime: format(
          new Date(formData.startDateTime),
          "yyyy-MM-dd'T'HH:mm:ss",
        ),
        endDateTime: format(
          new Date(formData.endDateTime),
          "yyyy-MM-dd'T'HH:mm:ss",
        ),
        projectMemberUsernames: formData.projectMemberUsernames,
      };

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
