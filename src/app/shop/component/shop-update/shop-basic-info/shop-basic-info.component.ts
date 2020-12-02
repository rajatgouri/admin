import { Component, OnInit, Input } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { ShopService } from '../../../services/shop.service';
import * as _ from 'lodash';

@Component({
  selector: 'shop-basic-info',
  templateUrl: './shop-basic-info.html'
})
export class ShopBasicInfoComponent implements OnInit {
  @Input() shop: any;
  public isSubmitted = false;

  // TODO - add option to query user from server by user id
  constructor(private toasty: ToastyService, private shopService: ShopService) { }

  ngOnInit() {
    // TODO - add event emitter listen the change
  }
  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please check and try again!');
    }
    const data = _.pick(this.shop, ['name', 'alias', 'address', 'city', 'state', 'country', 'zipcode', 'email', 'featured', 'shopType',
      'phoneNumber', 'logoId', 'verificationIssueId', 'bannerId', 'headerText', 'gaCode', 'announcement', 'activated', 'verified']);

    this.shopService.update(this.shop.id, data).then(resp => {
      this.toasty.success('Updated successfuly!');
    }).catch((err) => this.toasty.error(err.data.data.message));
  }
  selectLogo(data: any) {
    this.shop.logoId = data._id;
    this.shop.logo = data;
  }
  selectVerificationIssue(data: any) {
    this.shop.verificationIssueId = data._id;
    this.shop.verificationIssue = data;
  }
  selectBanner(data: any) {
    this.shop.bannerId = data._id;
    this.shop.banner = data;
  }
}
