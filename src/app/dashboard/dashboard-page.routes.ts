import { DashboardContainerComponent } from './containers/dashboard-container/dashboard-container.component';
import { AddProjectComponent } from './views/add-project/add-project.component';
import { EditProjectComponent } from './views/edit-project/edit-project.component';

export const dashboardPageRoutes = [
  { path: '', component: DashboardContainerComponent },
  {
    path: 'add',
    component: AddProjectComponent,
  },

  {
    path: 'edit/:id',
    component: EditProjectComponent,
  },
];
