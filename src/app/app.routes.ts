import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./authentication/authentication-page.routes').then(
        (m) => m.authenticationRoutes,
      ),
  },

  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard-page.routes').then(
        (m) => m.dashboardPageRoutes,
      ),
  },
];
