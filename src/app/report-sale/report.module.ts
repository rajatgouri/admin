import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReportRoutingModule } from "./report.routing";

import { SaleComponent } from "./components/sale/sale-report.component";
import { PayoutComponent } from "./components/payout/payout-report.component";

import { ReportSaleService } from "./report.service";
import { ShopService } from "../shop/services/shop.service";
import { RequestPayoutService } from "../request-payout/request-payout.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //our custom module
    ReportRoutingModule,
    NgbModule,
  ],
  declarations: [SaleComponent, PayoutComponent],
  providers: [ReportSaleService, ShopService, RequestPayoutService],
  exports: [],
})
export class ReportModule {}
