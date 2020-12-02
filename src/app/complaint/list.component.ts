import { Component, OnInit } from '@angular/core';
import { ComplainService } from './service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  templateUrl: './views/list.html'
})
export class ComplaintListingComponent implements OnInit {
  public items = [];
  public page = 1;
  public total = 0;

  constructor(private router: Router, private service: ComplainService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.service.search({
      page: this.page
    })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this complaints?')) {
      this.service.remove(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }
}
