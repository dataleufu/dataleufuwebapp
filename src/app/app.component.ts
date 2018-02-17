import {Component}          from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
declare let ga: Function;

@Component({
  selector: 'my-app',
  template: `<router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'RadarLeufú';

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

}
