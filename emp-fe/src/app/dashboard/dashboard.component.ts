import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: '<div class="page"><h2>{{ title }}</h2><p>Coming soon</p></div>'
})
export class DashboardComponent {
  title = '';
  constructor(route: ActivatedRoute) {
    this.title = route.snapshot.data['title'] || 'Dashboard';
  }
}
