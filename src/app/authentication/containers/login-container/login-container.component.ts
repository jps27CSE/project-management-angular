import { Component } from '@angular/core';
import { LoginComponent } from '../../views/login/login.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-container.component.html',
  styleUrl: './login-container.component.css',
})
export class LoginContainerComponent {
  constructor(private authService: AuthService) {}

  handleLoginSubmit(formData: { username: string; password: string }) {
    const data = {
      username: formData.username,
      password: formData.password,
    };

    this.authService.loginUser(data).subscribe(
      (response) => {
      
        if (response) {
          // Store the token in local storage
          localStorage.setItem('token', response);
          console.log('User logged in successfully');
        } else {
          console.log('Login failed');
        }
      },
      (error) => {
        console.error('Login error', error);
      },
    );
  }
}
