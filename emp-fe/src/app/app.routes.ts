import { Routes } from '@angular/router';
import { Grid } from './components/grid/grid';
import { PageComponent } from './page/page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: Grid },
  { path: 'dashboard', component: PageComponent, data: { title: 'Dashboard' } },
  { path: 'leave', component: PageComponent, data: { title: 'Leave' } },
  { path: 'reports', component: PageComponent, data: { title: 'Reports' } },
  { path: 'settings', component: PageComponent, data: { title: 'Settings' } }
];
