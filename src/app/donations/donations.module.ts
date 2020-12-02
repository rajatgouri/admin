import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DonationsRoutingModule } from "./donations.routing";

import { ListingComponent } from "./components/listing/listing.component";

import { DonationsService } from "./donations.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //our custom module
    DonationsRoutingModule,
    NgbModule,
  ],
  declarations: [ListingComponent],
  providers: [DonationsService],
  exports: [],
})
export class DonationsModule {}
