import { DashboardContainerComponent } from './containers/dashboard-container/dashboard-container.component';
import { AddProjectComponent } from './views/add-project/add-project.component';

export const dashboardPageRoutes = [
  { path: '', component: DashboardContainerComponent },
  {
    path: 'add',
    component: AddProjectComponent,
  },
];
