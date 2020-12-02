import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageListingComponent } from './components/listing/listing.component';
import { PackageUpdateComponent } from './components/form/update.component';
import { PackageCreateComponent } from './components/form/create.component';
import { PaymenPackageComponent } from './payment-package-history/history.component';

const routes: Routes = [
  {
    path: '',
    component: PackageListingComponent,
    data: {
      title: 'Package manager',
      urls: [{ title: 'Packages', url: '/packages' }, { title: 'Manage Packages' }]
    }
  },
  {
    path: 'create',
    component: PackageCreateComponent,
    data: {
      title: 'Package Create',
      urls: [{ title: 'Packages', url: '/packages' }, { title: 'New Package' }]
    }
  },
  {
    path: 'update/:id',
    component: PackageUpdateComponent,
    data: {
      title: 'Package Update',
      urls: [{ title: 'Packages', url: '/packages' }, { title: 'Update Package' }]
    }
  },
  {
    path: 'history',
    component: PaymenPackageComponent,
    data: {
      title: 'Package Payment History',
      urls: [{ title: 'Packages', url: '/packages' }, { title: 'History Payment Packages' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageRoutingModule { }
