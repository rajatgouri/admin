import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'user-update',
  templateUrl: './update.html'
})
export class UserUpdateComponent implements OnInit {
  public info: any = {};
  public avatarUrl = '';
  public isSubmitted = false;
  public avatarOptions: any = {};
  public user: any = {};
  private userId: string;
  private phoneNumber : any = "";
  public isVerified: boolean = false;

  constructor(private router: Router, private userService: UserService, private toasty: ToastyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.avatarOptions = {
      url: window.appConfig.apiBaseUrl + '/users/' + this.userId + '/avatar',
      fileFieldName: 'avatar',
      onFinish: resp => this.avatarUrl = resp.data.url
    }

    this.userService.findOne(this.userId).then(resp => {
      this.user = resp.data;
      this.info = _.pick(resp.data, [
        'name', 'email', 'isActive', 'emailVerified', 'address', 'role', 'emailNotification', 'type', 'phoneNumber', 'streetAddress', 'city', 'state', 'country', 'zipCode', 'shippingAddress'
      ]);
      this.avatarUrl = resp.data.avatarUrl;
      this.phoneNumber = resp.data.phoneNumber;
      this.isVerified = resp.data.phoneVerified;
    });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }

    this.info.phoneVerified = this.isVerified
    if(!this.info.phoneVerified) {
      return this.toasty.error('Phone verification is pending!');
    }
    this.info.phoneNumber = this.info.phoneNumber.e164Number;

    this.userService.update(this.userId, this.info).then(resp => {
      this.toasty.success('Updated successfuly!');
      this.router.navigate(['/users/list']);
      this.phoneNumber = this.info.phoneNumber
    }).catch(err => console.log(err));
  }

  changePhoneNumber(ev) {
    if(ev && ev.e164Number) {
      let newph = ev.e164Number;
      if(newph != this.phoneNumber) {
        this.isVerified = false
      } else this.isVerified = true
    } else this.isVerified = false
  }

  onVerifyApprove(ev) {
    if(ev == true) {
      this.isVerified = true
    } else this.isVerified = false
  }
}
