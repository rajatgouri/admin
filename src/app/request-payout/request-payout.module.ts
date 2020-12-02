import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Routes, RouterModule } from "@angular/router";

import { ListingComponent } from "./component/listing.component";
import { ViewComponent } from "./component/view.component";

import { RequestPayoutService } from "./request-payout.service";
import { ProductService } from "../product/services/product.service";

const routes: Routes = [
  {
    path: "",
    component: ListingComponent,
    data: {
      title: "Request Payout Manager",
      urls: [{ title: "Requests Payout" }],
    },
  },
  {
    path: ":id",
    component: ViewComponent,
    data: {
      title: "Request Payout Manager",
      urls: [{ title: "Request Payout" }],
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgbModule,
  ],
  declarations: [ListingComponent, ViewComponent],
  providers: [RequestPayoutService, ProductService],
  exports: [],
})
export class RequestPayoutModule {}
