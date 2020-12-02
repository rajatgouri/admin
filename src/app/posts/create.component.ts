import { Component, OnInit } from '@angular/core';
import { PostService } from './service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  templateUrl: './views/form.html'
})
export class PostCreateComponent implements OnInit {
  public item: any = {};

  constructor(private router: Router, private postService: PostService, private toasty: ToastyService) {
  }

  ngOnInit() {
  }

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please try again');
    }
    this.postService.create(this.item)
      .then(resp => {
        this.toasty.success('Created successfully!');
        this.router.navigate(['/posts']);
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }
}
