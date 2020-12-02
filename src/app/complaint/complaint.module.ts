import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ComplaintListingComponent } from "./list.component";
import { ComplaintUpdateComponent } from "./update.component";

import { ComplainService } from "./service";

const routes: Routes = [
  {
    path: "",
    component: ComplaintListingComponent,
    data: {
      title: "Manage complaints",
      urls: [{ title: "Complaints", url: "/complaints" }, { title: "Listing" }],
    },
  },
  {
    path: "update/:id",
    component: ComplaintUpdateComponent,
    data: {
      title: "Manage complaints",
      urls: [
        { title: "Complaints", url: "/complaints" },
        { title: "Update Complaint" },
      ],
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
  declarations: [ComplaintListingComponent, ComplaintUpdateComponent],
  providers: [ComplainService],
  exports: [],
  entryComponents: [],
})
export class ComplaintModule {}
