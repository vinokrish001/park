import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: true,
  template: '<div class="page"><h2>{{ title }}</h2><p>Coming soon</p></div>'
})
export class PageComponent {
  title = '';
  constructor(route: ActivatedRoute) {
    this.title = route.snapshot.data['title'] || '';
  }
}
