import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services';
import { Router, NavigationEnd } from '@angular/router';
import { SystemService } from './shared/services';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Seller';

  constructor(private router: Router, private authService: AuthService, private systemService: SystemService) {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        $('html, body').animate({ scrollTop: 0 });
      }
    });
    this.systemService.configs().then(resp => {
      // change favicon
      $('#favicon').attr('href', resp.siteFavicon);
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedin()) {
      this.authService.getCurrentUser();
    }
  }
}
