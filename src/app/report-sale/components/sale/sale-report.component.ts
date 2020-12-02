import { Component, OnInit, Input } from '@angular/core';
import { ReportSaleService } from '../../report.service';
import { ShopService } from '../../../shop/services/shop.service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as async from 'async';

@Component({
  selector: 'report-sale',
  templateUrl: './sale-report.html'
})
export class SaleComponent implements OnInit {
  public shops: any = [];
  public page: number = 1;
  public take: number = 10;
  public totalShops: number = 0;
  public searchFields: any = {
    name: ''
  };

  constructor(private router: Router, private shopService: ShopService, private reportService: ReportSaleService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.shopService.search(Object.assign({ page: this.page }, this.searchFields))
      .then(resp => {
        this.shops = resp.data.items;
        this.totalShops = resp.data.count;
        async.eachSeries(this.shops, (shop, cb) => {
          this.reportService.saleStat({
            shopId: shop._id
          }).then(resp => {
            shop.saleStats = resp.data;
            cb();
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
