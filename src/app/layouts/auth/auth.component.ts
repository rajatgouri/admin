import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'auth-layout',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  public appConfig: any = {};

  constructor(public router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.appConfig = this.route.snapshot.data.appConfig;
  }
}
