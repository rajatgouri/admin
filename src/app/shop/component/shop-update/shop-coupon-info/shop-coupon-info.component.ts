import { Component, OnInit, Input } from '@angular/core';
import { CouponService } from '../../../services/coupon.service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'shop-coupon-info',
  templateUrl: './shop-coupon-info.html'
})
export class CouponsComponent implements OnInit {

  @Input() shop: any;
  public coupons = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public searchText: any = '';
  public sortOption: any = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private router: Router, private couponService: CouponService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    const params = {
      page: this.page,
      take: this.take,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`,
      q: this.searchText,
      shopId: this.shop._id
    };

    this.couponService.find(params).then((res) => {
      this.coupons = res.data.items;
      this.total = res.data.count;
    }).catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
    }
  }
}
