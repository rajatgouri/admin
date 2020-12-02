import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'product-categories',
  templateUrl: './categories.html'
})
export class ProductCategoriesComponent implements OnInit {
  public items = [];

  constructor(private router: Router, private categoryService: ProductCategoryService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.categoryService.tree()
      .then(resp => this.items = this.categoryService.prettyPrint(resp.data))
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this category?')) {
      this.categoryService.remove(item._id)
        .then(() => {
          this.toasty.success('Category has been deleted!');
          this.items.splice(index, 1);
        })
        .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }
}

@Component({
  selector: 'product-category-create',
  templateUrl: './form.html'
})
export class ProductCategoryCreateComponent implements OnInit {
  public category: any = {
    name: '',
    description: '',
    mainImage: null
  };
  public tree: any = [];
  public imageUrl: string = '';

  constructor(private router: Router, private categoryService: ProductCategoryService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.categoryService.tree()
      .then(resp => (this.tree = this.categoryService.prettyPrint(resp.data)));
  }

  submit(frm: any) {
    if (!this.category.name) {
      return this.toasty.error('Please enter category name');
    }

    this.categoryService.create(this.category)
      .then(() => {
        this.toasty.success('Category has been updated');
        this.router.navigate(['/products/categories']);
      }, err => this.toasty.error(err.data.message || 'Something went wrong!'));
  }

  remove(field: string, index: any) {
    this.category[field].splice(index, 1);
  }

  selectImage(media: any) {
    this.category.mainImage = media._id;
    this.imageUrl = media.fileUrl;
  }
}

@Component({
  selector: 'product-category-update',
  templateUrl: './form.html'
})
export class ProductCategoryUpdateComponent implements OnInit {
  private groupId: string;
  public category: any = {};
  public tree: any = [];
  public imageUrl: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private categoryService: ProductCategoryService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.categoryService.findOne(this.groupId)
      .then(resp => {
        this.category = resp.data;
        if (typeof this.category.mainImage === 'string') {
          this.imageUrl = this.category.mainImage;
        } else if (this.category.mainImage) {
          this.imageUrl = this.category.mainImage.fileUrl;
          this.category.mainImage = this.category.mainImage._id;
        }
        return true;
      })
      .then(() => this.categoryService.tree())
      .then(resp => {
        this.categoryService.removeChild(resp.data, this.category._id);
        this.tree = this.categoryService.prettyPrint(resp.data)
      });
  }

  submit(frm: any) {
    if (!this.category.name) {
      return this.toasty.error('Please enter category name');
    }

    this.categoryService.update(this.groupId, this.category)
      .then(() => {
        this.toasty.success('Category has been updated');
        this.router.navigate(['/products/categories']);
      }, err => this.toasty.error(err.data.message || 'Something went wrong!'));
  }

  remove(field: string, index: any) {
    this.category[field].splice(index, 1);
  }

  selectImage(media: any) {
    this.category.mainImage = media._id;
    this.imageUrl = media.fileUrl;
  }
}
