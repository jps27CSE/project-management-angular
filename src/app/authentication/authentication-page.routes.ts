import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { RegistrationContainerComponent } from './containers/registration-container/registration-container.component';

export const authenticationRoutes = [
  { path: 'login', component: LoginContainerComponent },
  {
    path: 'register',
    component: RegistrationContainerComponent,
  },
];
