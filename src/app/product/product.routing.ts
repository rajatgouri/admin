import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoriesComponent, ProductCategoryCreateComponent, ProductCategoryUpdateComponent } from './category/category.component';
import { OptionsComponent, OptionCreateComponent, OptionUpdateComponent } from './options/options.component';
import { ProductListingComponent } from './product/listing.component';
import { ProductUpdateComponent } from './product/update.component';
import { ProductCreateComponent } from './product/create.component';
import { ReviewsComponent } from './reviews/listing.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListingComponent,
    data: {
      title: 'Product Listing',
      urls: [{ title: 'Products', url: '/products' }, { title: 'Manage Products' }]
    }
  },
  {
    path: 'create',
    component: ProductCreateComponent,
    data: {
      title: 'Product Create',
      urls: [{ title: 'Products', url: '/products' }, { title: 'New Product' }]
    }
  },
  {
    path: 'update/:id',
    component: ProductUpdateComponent,
    data: {
      title: 'Product Update',
      urls: [{ title: 'Products', url: '/products' }, { title: 'Update Product' }]
    }
  },
  {
    path: 'categories',
    component: ProductCategoriesComponent,
    data: {
      title: 'Product category manager',
      urls: [{ title: 'Products', url: '/products' }, { title: 'Categories', url: '/products/categories' }, { title: 'Manage categories' }]
    }
  },
  {
    path: 'categories/create',
    component: ProductCategoryCreateComponent,
    data: {
      title: 'Product category manager',
      urls: [{ title: 'Products', url: '/products' }, { title: 'Categories', url: '/products/categories' }, { title: 'Create new category' }]
    }
  },
  {
    path: 'categories/update/:id',
    component: ProductCategoryUpdateComponent,
    data: {
      title: 'Product category manager',
      urls: [{ title: 'Products', url: '/products' }, { title: 'Categories', url: '/products/categories' }, { title: 'Update category' }]
    }
  },
  {
    path: 'options',
    component: OptionsComponent,
    data: {
      title: 'Options managner',
      urls: [{ title: 'Options', url: '/products/options' }, { title: 'Manage options' }]
    }
  },
  {
    path: 'options/create',
    component: OptionCreateComponent,
    data: {
      title: 'Options manager',
      urls: [{ title: 'Options', url: '/products/options' }, { title: 'Create new option' }]
    }
  },
  {
    path: 'options/update/:id',
    component: OptionUpdateComponent,
    data: {
      title: 'Options manager',
      urls: [{ title: 'Options', url: '/products/options' }, { title: 'Update option' }]
    }
  },
  {
    path: 'reviews',
    component: ReviewsComponent,
    data: {
      title: 'Reviews managner',
      urls: [{ title: 'Reviews', url: '/reviews' }, { title: 'Manage reviews' }]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
