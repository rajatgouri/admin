import { Component, OnInit, Input } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'reviews-listing',
  templateUrl: './listing.html'
})
export class ReviewsComponent implements OnInit {
  @Input() product: any;
  public items = [];
  public page: number = 1;
  public total: number = 0;
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private router: Router, private reviewService: ReviewService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.reviewService.search({
      productId: this.product._id,
      page: this.page,
      sort: `${this.sortOption.sortBy}`,
      sortType:  `${this.sortOption.sortType}`
    })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(itemId: any, index: number) {
    if (window.confirm('Are you sure want to delete this item?')) {
      this.reviewService.remove(itemId)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

}
