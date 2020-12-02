import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';

@Component({
  selector: 'order-view',
  templateUrl: './view.html'
})
export class ViewComponent implements OnInit {
  public order: any = {};
  public details: any = [];

  constructor(private router: Router, private route: ActivatedRoute,
    private orderService: OrderService, private toasty: ToastyService) {
    const id = this.route.snapshot.params.id;
    this.orderService.findOne(id).then((res) => {
      this.order = res.data;
      this.details = res.data.details;
    });
  }

  ngOnInit() {
  }

  updateStatus(item, index) {
    const data = _.pick(item, ['status']);

    this.orderService.update(item._id, data).then(resp => {
      this.toasty.success('Updated successfuly!');
      this.details[index].status = item.status;
    }).catch((err) => this.toasty.error('Something went wrong, please try again!'));
  }
}
