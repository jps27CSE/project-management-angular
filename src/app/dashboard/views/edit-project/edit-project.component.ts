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

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  editProjectForm: FormGroup;
  projectId!: number;

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
    if (this.projectMemberUsernames.length < 5) {
      this.projectMemberUsernames.push(this.fb.control(''));
    }
  }

  removeMember(index: number) {
    this.projectMemberUsernames.removeAt(index);
  }

  onSubmit() {
    if (this.editProjectForm.valid) {
      const formData = this.editProjectForm.value;

      const filteredMemberUsernames = formData.projectMemberUsernames.filter(
        (username: string) => username.trim() !== '',
      );

      const data = {
        name: formData.name,
        intro: formData.intro,
        status: String(formData.status),
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
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
      });
      this.projectMemberUsernames.clear();
      project.projectMemberUsernames.forEach((username: any) => {
        this.projectMemberUsernames.push(this.fb.control(username));
      });
    });
  }
}
