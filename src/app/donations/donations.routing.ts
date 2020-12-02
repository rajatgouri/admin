import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './components/listing/listing.component';

const routes: Routes = [
  {
    path: '',
    component: ListingComponent,
    data: {
      title: 'Buy us a Coffee Donations',
      urls: [{ title: 'Donations', url: '/donations' }, { title: 'Donations' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationsRoutingModule { }
