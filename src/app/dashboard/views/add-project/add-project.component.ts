import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  @Input() projectId?: number;

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
    if (this.projectMemberUsernames.length < 5) {
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
        status: String(formData.status), // Convert status to string to match API format
        startDate: formData.startDate
          ? format(new Date(formData.startDate), 'yyyy-MM-dd')
          : null,
        endDate: formData.endDate
          ? format(new Date(formData.endDate), 'yyyy-MM-dd')
          : null,
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
