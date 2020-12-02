import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublishModalComponent } from './publishModal/publish-modal.component';

@Component({
  selector: 'product-listing',
  templateUrl: './listing.html'
})
export class ProductListingComponent implements OnInit {
  public items = [];
  public page: any = 1;
  public total: any = 0;
  public searchText: any = '';
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private router: Router, private productService: ProductService, private toasty: ToastyService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.productService.search({
      page: this.page,
      q: this.searchText,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`
    })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
        this.searchText = '';
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  remove(itemId: any, index: number) {
    if (window.confirm('Are you sure want to delete this item?')) {
      this.productService.remove(itemId)
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

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
    }
  }

  publish(item, publish, index) {
    
    let data = {};
    
    if (publish) {
      const modalRef = this.modalService.open(PublishModalComponent, {
        backdrop: 'static',
        keyboard: false
      });

      modalRef.result.then(result => {
        data = {
          productId: item,
          publish: false,
          reasonForNotPublish: result
        }
        this.productService.publish(data).then((res) => {
        this.items[index].publish = false;

          this.toasty.success('Product is Publish')
        }).catch(err => {
          this.toasty.error('Something went wrong')
        })
      })

    } else {
      data = {
        publish: true,
        productId: item
      }

      this.productService.publish(data).then((res) => {
        this.items[index].publish = true;
        this.toasty.success('Product is Publish')
      }).catch(err => {
        this.toasty.error('Something went wrong')
      })
    }


    
  }

}
