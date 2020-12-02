import { Component, OnInit } from '@angular/core';
import { RequestPayoutService } from '../../../request-payout/request-payout.service';
import { ShopService } from '../../../shop/services/shop.service';
import { ToastyService } from 'ng2-toasty';
import * as async from 'async';

@Component({
  selector: 'report-payout',
  templateUrl: './payout-report.html'
})
export class PayoutComponent implements OnInit {

  public shops: any = [];
  public page: any = 1;
  public total: any = 0;
  public searchFields: any = {
    name: ''
  }

  constructor(private toasty: ToastyService, private shopService: ShopService, private payoutService: RequestPayoutService) { }

  ngOnInit() {
    this.query();
  }

  query() {
    this.shopService.search(Object.assign({ page: this.page }, this.searchFields))
      .then(resp => {
        this.shops = resp.data.items;
        this.total = resp.data.count;
        async.eachSeries(this.shops, (shop, cb) => {
          this.payoutService.stats({
            shopId: shop._id
          }).then(resp => {
            shop.payout = resp.data;
            return this.payoutService.shopBalance(shop._id)
              .then(resp => {
                shop.balance = resp.data;
                cb();
              });
          }).catch(() => cb())
        });
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
    }
  }
}
