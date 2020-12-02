import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './components/listing/listing.component';

const routes: Routes = [
  {
    path: '',
    component: ListingComponent,
    data: {
      title: 'Refund management',
      urls: [{ title: 'Refunds', url: '/refunds' }, { title: 'Listing' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRoutingModule { }
