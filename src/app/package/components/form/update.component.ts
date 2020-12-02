import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../service/package.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'package-update',
  templateUrl: './form.html'
})

export class PackageUpdateComponent implements OnInit {
  public package: any;

  public isSubmitted: any = false;

  constructor(private router: Router, private route: ActivatedRoute,
    private packageService: PackageService, private toasty: ToastyService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.packageService.findOne(id)
      .then(resp => {
        this.package = resp.data;
      });
  }

  submit(frm) {
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

    if (this.package.duration <= 0) {
      return this.toasty.error('Invalid duration time.');
    }
    const data = _.pick(this.package, ['price', 'name', 'numDays', 'description']);
    this.packageService.update(this.package._id, data).then(() => {
      this.toasty.success('Updated successfully.');
      this.router.navigate(['/packages']);
    }).catch(err => this.toasty.error('Something went wrong, please try again!'));
  }
}
