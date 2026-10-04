import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  {
    path: 'employees',
    loadChildren: () =>
      import('./employees/employees.module').then((m) => m.EmployeesModule),
    data: { title: 'Employees' }
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { title: 'Dashboard' }
  }
];
