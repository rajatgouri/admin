import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleComponent } from './components/sale/sale-report.component';
import { PayoutComponent } from './components/payout/payout-report.component';

const routes: Routes = [
  {
    path: 'sales',
    component: SaleComponent,
    data: {
      title: 'Sales management',
      urls: [{ title: 'Report' }, { title: 'Sales' }]
    }
  },
  {
    path: 'payout',
    component: PayoutComponent,
    data: {
      title: 'Payout management',
      urls: [{ title: 'Report' }, { title: 'Payout' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
