import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'profile-update',
  templateUrl: './form.html'
})
export class ProfileUpdateComponent implements OnInit {
  public info: any = {};
  public avatarUrl = '';
  public isSubmitted = false;
  public avatarOptions: any = {};
  public user: any = {};
  private userId: string;

  constructor(private router: Router, private userService: UserService, private toasty: ToastyService, private route: ActivatedRoute){ }

  ngOnInit() {
    this.avatarOptions = {
      url: window.appConfig.apiBaseUrl + '/users/avatar',
      fileFieldName: 'avatar',
      onFinish: (resp) => {
        this.avatarUrl = resp.data.url;
        this.user.avatarUrl = resp.data.url;
      }
    }

    this.userService.me().then(resp => {
      this.user = resp.data;
      this.info = _.pick(resp.data, [
        'name', 'email', 'address', 'phoneNumber'
      ]);
      this.avatarUrl = resp.data.avatarUrl;
    });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }

    this.userService.update(this.userId, this.info).then(resp => {
      this.toasty.success('Updated successfuly!');
    }).catch ((err) => this.toasty.error(err.data.data.message || err.data.data.email));
  }
}
