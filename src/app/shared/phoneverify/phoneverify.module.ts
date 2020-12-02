import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PhoneverifyComponent } from './phoneverify.component';



@NgModule({
  declarations: [PhoneverifyComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  exports: [PhoneverifyComponent]
})
export class PhoneverifyModule { }
