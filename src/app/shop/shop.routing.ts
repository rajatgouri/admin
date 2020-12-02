import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopListingComponent, ShopUpdateComponent, ShopCreateComponent } from './component';

const routes: Routes = [
  {
    path: '',
    component: ShopListingComponent,
    data: {
      title: 'Shops manager',
      urls: [{ title: 'Shops',url: '/shops/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id', component: ShopUpdateComponent,
    data: {
      title: 'Shops manager',
      urls: [{ title: 'Shops',url: '/shops/update' }, { title: 'Update' }]
    }
  },
  {
    path: 'create', component: ShopCreateComponent,
    data: {
      title: 'Shops manager',
      urls: [{ title: 'Shops',url: '/shops/create' }, { title: 'Create' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
