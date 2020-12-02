import { Component, OnInit } from '@angular/core';
import { RequestPayoutService } from '../request-payout.service';
import { ToastyService } from 'ng2-toasty';
import { ProductService } from '../../product/services/product.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'request-payout-listing',
  templateUrl: './listing.html'
})
export class ListingComponent implements OnInit {
  public items = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public searchFields: any = {
  };
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public dateFilter: any = {
    startDate: '',
    toDate: ''
  };
  public stats: any;
  public seller: any;
  public searching: any = false;
  public searchFailed: any = false;
  formatter = (x: { name: string }) => x.name;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.productService.findSeller({ name: term }).then((res) => {
          if (res) {
            this.searchFailed = false;
            this.searching = false;
            return res.data.items;
          }
          this.searchFailed = true;
          this.searching = false;
          return of([]);
        })
      )
    )

  constructor(private payoutService: RequestPayoutService,
    private toasty: ToastyService, private productService: ProductService) {
  }

  ngOnInit() {
    this.query();
    this.queryStats();
  }

  query() {
    this.payoutService.search(Object.assign({
      page: this.page,
      take: this.take,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`
    }, this.searchFields))
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  changeUTCDate() {
    if (this.dateFilter.startDate !== '' && this.dateFilter.toDate !== '') {
      const startUTCDate = new Date(this.dateFilter.startDate.year, this.dateFilter.startDate.month - 1, this.dateFilter.startDate.day);
      this.dateFilter.startDate = startUTCDate.toUTCString();
      const toUTCDate = new Date(this.dateFilter.toDate.year, this.dateFilter.toDate.month - 1, this.dateFilter.toDate.day);
      this.dateFilter.toDate = toUTCDate.toUTCString();
      if (startUTCDate > toUTCDate) {
        return 0;
      }
    }
  }

  queryStats() {
    if (this.changeUTCDate() === 0) {
      return this.toasty.error('Start date must be less than end date!');
    }
    const params = {
      startDate: this.dateFilter.startDate,
      toDate: this.dateFilter.toDate,
      shopId: ''
    };
    if (this.seller) {
      params.shopId = this.seller._id;
    }
    this.payoutService.stats(params)
      .then(resp => {
        this.stats = resp.data;
      });
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

}
