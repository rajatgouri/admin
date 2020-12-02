import { Component, OnInit, Input } from '@angular/core';
import { PackageService } from '../../service/package.service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'packages-listing',
  templateUrl: './listing.html'
})
export class PackageListingComponent implements OnInit {

  public packages = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public searchText: any = '';
  public sortOption: any = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private router: Router, private packageService: PackageService, private toasty: ToastyService) {
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
      q: this.searchText,
    };

    this.packageService.search(params).then(resp => {
      this.packages = resp.data.items;
      this.total = resp.data.count;
    }).catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  remove(itemId: any, index: number) {
    if (window.confirm('Are you sure want to delete this pakage?')) {
      this.packageService.remove(itemId)
        .then(() => {
          this.toasty.success('Pakage has been deleted!');
          this.packages.splice(index, 1);
        })
        .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }

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
