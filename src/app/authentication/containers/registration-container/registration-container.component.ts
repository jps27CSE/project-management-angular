import { Component } from '@angular/core';
import { RegistrationComponent } from '../../views/registration/registration.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-registration-container',
  standalone: true,
  imports: [RegistrationComponent],
  templateUrl: './registration-container.component.html',
  styleUrl: './registration-container.component.css',
})
export class RegistrationContainerComponent {
  constructor(private authService: AuthService) {}

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
          console.log('User registered successfully');
        } else {
          console.log('Registration failed');
        }
      },
      (error: any) => {
        console.error('Registration error', error);
      },
    );
  }
}
