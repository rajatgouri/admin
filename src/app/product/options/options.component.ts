import { Component, OnInit } from '@angular/core';
import { OptionService } from '../services/option.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'options',
  templateUrl: './options.html'
})
export class OptionsComponent implements OnInit {
  public items = [];
  public page = 1;
  public total = 0;

  constructor(private router: Router, private optionService: OptionService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.optionService.search({
      page: this.page
    })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this option?')) {
      this.optionService.remove(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }
}

@Component({
  selector: 'option-create',
  templateUrl: './form.html'
})
export class OptionCreateComponent implements OnInit {
  public option: any = {
    name: '',
    key: '',
    description: '',
    options: []
  };
  public newOption: any = {};

  constructor(private router: Router, private optionService: OptionService, private toasty: ToastyService) {
  }

  ngOnInit() { }

  addOption() {
    if (!this.newOption.key || !this.newOption.displayText) {
      return this.toasty.error('Please enter option value');
    }
    this.option.options.push(this.newOption);
    this.newOption = {};
  }

  removeOption(index: any) {
    if (window.confirm('Are you sure want to delete this item?')) {
      this.option.options.splice(index, 1);
    }
  }

  submit(frm: any) {
    if (!this.option.name) {
      return this.toasty.error('Please enter option name');
    }

    this.optionService.create(this.option)
      .then(() => {
        this.toasty.success('Option has been updated');
        this.router.navigate(['/products/options']);
      }, err => this.toasty.error(err.data.data.details[0].message || err.data.message || 'Something went wrong!'));
  }
}

@Component({
  selector: 'option-update',
  templateUrl: './form.html'
})
export class OptionUpdateComponent implements OnInit {
  public option: any;
  public newOption: any = {};

  constructor(private router: Router, private route: ActivatedRoute, private optionService: OptionService, private toasty: ToastyService) {
  }

  ngOnInit() {
    let optionId = this.route.snapshot.paramMap.get('id');
    this.optionService.findOne(optionId)
      .then(resp => this.option = resp.data);
  }

  addOption() {
    if (!this.newOption.key || !this.newOption.displayText) {
      return this.toasty.error('Please enter option value');
    }
    this.option.options.push(this.newOption);
    this.newOption = {};
  }

  removeOption(index: any) {
    if (window.confirm('Are you sure want to delete this item?')) {
      this.option.options.splice(index, 1);
    }
  }

  submit(frm: any) {
    if (!this.option.name) {
      return this.toasty.error('Please enter option name');
    }

    this.optionService.update(this.option._id, this.option)
      .then(() => {
        this.toasty.success('option has been updated');
        this.router.navigate(['/products/options']);
      }, err => this.toasty.error(err.data.message || 'Something went wrong!'));
  }
}
