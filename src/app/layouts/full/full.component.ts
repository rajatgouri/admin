import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
  @ViewChild('top') top: ElementRef;
  color = 'defaultdark';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  public appConfig: any;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(public router: Router) {
    this.appConfig = window.appConfig;
  }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard/dashboard1']);
    }
  }

  scrollTop() {
    this.top.nativeElement.scrollTo(0, 0);
  }

}
