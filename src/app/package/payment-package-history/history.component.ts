import { Component, OnInit } from '@angular/core';
import { PackageService } from '../service/package.service';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'payment-package-history',
  templateUrl: './history.html'
})
export class PaymenPackageComponent implements OnInit {
  public searchFields: any = {
  };
  public isLoading = false;
  public packages = [];
  public total: Number = 0;
  public take = 10;
  public page = 1;

  constructor(private packageService: PackageService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.isLoading = true;
    const params = Object.assign({
      take: this.take,
      page: this.page,
      type: 'shop_featured'
    }, this.searchFields);
    this.packageService.history(params).then(resp => {
      this.packages = resp.data.items;
      this.total = resp.data.count;
      this.isLoading = false;
    }).catch((err) => {
      this.toasty.error(err.data.message || 'Something went wrong, please try again!');
      this.isLoading = false;
    });
  }

}
