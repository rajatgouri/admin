import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SortablejsModule } from "ngx-sortablejs";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { PackageRoutingModule } from "./package.routing";

import { PackageListingComponent } from "./components/listing/listing.component";
import { PackageUpdateComponent } from "./components/form/update.component";
import { PackageCreateComponent } from "./components/form/create.component";
import { PaymenPackageComponent } from "./payment-package-history/history.component";

import { PackageService } from "./service/package.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SortablejsModule,
    PackageRoutingModule,
    NgbModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ],
  declarations: [
    PackageListingComponent,
    PackageUpdateComponent,
    PackageCreateComponent,
    PaymenPackageComponent,
  ],
  providers: [PackageService],
  exports: [],
})
export class PackageModule {}
