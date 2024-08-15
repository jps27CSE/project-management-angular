import { Component } from '@angular/core';
import { RegistrationComponent } from '../../views/registration/registration.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-container',
  standalone: true,
  imports: [RegistrationComponent],
  templateUrl: './registration-container.component.html',
  styleUrls: ['./registration-container.component.css'],
})
export class RegistrationContainerComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  handleRegisterSubmit(formData: {
    name: string;
    username: string;
    password: string;
  }) {
    console.log(formData);
    const data = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
    };

    this.authService.registerUser(data).subscribe(
      (response) => {
        if (response) {
          // Store the token in local storage
          localStorage.setItem('token', response);
          this.router.navigate(['']);
        } else {
          console.log('Registration failed');
        }
      },
      (error: any) => {
        if (error.status === 500) {
          // Handle specific error with status code 500
          window.alert('Username already registered');
        } else {
          console.error('Registration error', error);
        }
      },
    );
  }
}
