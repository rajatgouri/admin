import { Component, OnInit } from '@angular/core';
import { PostService } from './service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  templateUrl: './views/form.html'
})
export class PostUpdateComponent implements OnInit {
  public item: any = {};

  constructor(private router: Router, private route: ActivatedRoute, private postService: PostService, private toasty: ToastyService) {
    const id = this.route.snapshot.params.id;
    this.postService.findOne(id).then(resp => this.item = resp.data)
      .catch(() => this.toasty.error('Something went wrong, please try again.'));
  }

  ngOnInit() {
  }

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please try again');
    }
    const data = _.pick(this.item, ['title', 'alias', 'content']);
    this.postService.update(this.item._id, data)
      .then(resp => {
        this.toasty.success('Updated successfully!');
        this.router.navigate(['/posts']);
      })
      .catch(() => this.toasty.error('Something went wrong, please try again.'));
  }
}
