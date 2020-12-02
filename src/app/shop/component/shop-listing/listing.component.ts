import { Component, OnInit, Input } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { UtilService } from '../../../shared/services';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'shops-listing',
  templateUrl: './listing.html'
})
export class ShopListingComponent implements OnInit {

  public isLoading = false;
  private loadingSubscription: Subscription;
  public items = [];
  public page: number = 1;
  public total: number = 0;
  public searchFields: any = {
    activated: '',
    featured: '',
    verified: '',
    email: '',
    name: ''
  };
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public owner: any = '';
  public searching: boolean = false;
  public searchFailed: boolean = false;

  formatter = (x: {
    name: string
  }) => x.name;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.shopService.findOwner({
          name: term
        }).then((res) => {
          if (res) {
            this.searchFailed = false;
            this.searching = false;
            return res.data.items;
          }
          this.searchFailed = false;
          this.searching = false;
          return of([])
        })
      )
    );

  constructor(
    private router: Router,
    private shopService: ShopService,
    private toasty: ToastyService,
    private utilService: UtilService
  ) {
    this.loadingSubscription = utilService.appLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  ngOnInit() {
    this.query();
  }

  selectOwner(event: any) {
    this.owner = event.item;
    this.query();
  }

  query() {
    this.utilService.setLoading(true);
    if (this.owner) {
      if (this.owner._id) {
        this.searchFields.ownerId = this.owner._id;
      } else {
        return this.toasty.error('Can not find this owner, please enter another ownner');
      }
    }
    this.shopService.search(Object.assign({
      page: this.page,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`
    }, this.searchFields))
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
        this.searchFields = {};
        this.utilService.setLoading(false);
      })
      .catch(() => {
        this.toasty.error('Something went wrong, please try again!');
        this.utilService.setLoading(false);
      });
  }

  // remove(itemId: any, index: number) {
  //   if (window.confirm('Are you sure want to delete this item?')) {
  //     this.shopService.remove(itemId)
  //       .then(() => {
  //         this.toasty.success('Item has been deleted!');
  //         this.items.splice(index, 1);
  //       })
  //       .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
  //   }
  // }

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
    }
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }
}
