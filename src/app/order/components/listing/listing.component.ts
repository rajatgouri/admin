import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'order-listing',
  templateUrl: './listing.html'
})
export class ListingComponent implements OnInit {

  public orders = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public trackingCode: any = '';
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private router: Router, private orderService: OrderService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    let params = {
      page: this.page,
      take: this.take,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`,
      trackingCode: this.trackingCode
    };

    this.orderService.find(params).then((res) => {
      this.orders = res.data.items;
      this.total = res.data.count;
    })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));

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
