import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../service/package.service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'package-create',
  templateUrl: './form.html'
})
export class PackageCreateComponent implements OnInit {
  public package: any = {
    name: '',
    description: '',
    price: '',
    numDays: ''
  };

  public isSubmitted: any = false;

  constructor(private router: Router, private packageService: PackageService, private toasty: ToastyService) {
  }

  ngOnInit() { }

  submit(frm: any) {
    this.isSubmitted = true;
    if (frm.invalid) {
      return this.toasty.error('Form is invalid, please try again.');
    }

    if (this.package.price < 0) {
      return this.toasty.error('Please enter price value must be greater than 0');
    } else if (this.package.numDays < 0) {
      return this.toasty.error('Please enter duration value must be greater than 0');
    } else if (this.package.ordering < 0) {
      return this.toasty.error('Please enter ordering value must be greater than 0');
    }

    this.packageService.create(this.package)
      .then(() => {
        this.toasty.success('Package has been created');
        this.router.navigate(['/packages']);
      }, err => this.toasty.error('Something went wrong, please try again!'));
  }
}
