import { Component } from '@angular/core';
import { RequestPayoutService } from '../request-payout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";

@Component({
  selector: 'view-request-payout',
  templateUrl: './view.html'
})
export class ViewComponent {
  public item: any = {};
  public payoutAmount: any = '';
  public payoutModalRef:any = '';
  public info: any = {
    note: '',
    reason: ''
  };
  public status: any;
  constructor(private router: Router, private route: ActivatedRoute, private payoutService: RequestPayoutService,
    private toasty: ToastyService,
    private modalService: NgbModal) {
    const id = this.route.snapshot.params.id;
    this.payoutService.findOne(id).then(res => {
      this.item = res.data;
      console.log(this.item);
      this.payoutAmount = res.data.shopBalance;
      this.status = res.data.status;
    });
  }

  reject(item) {
    if (this.status === 'rejected') {
      return this.toasty.error('This request has been rejected, can not be changed status');
    }
    if (this.status === 'approved') {
      return this.toasty.error('This request has been approved, can not be changed status');
    }
    if (!this.info.note) {
      return this.toasty.error('Please leave a message');
    }
    this.payoutService.reject(item._id, { rejectReason: this.info.rejectReason, note: this.info.note }).then(res => {
      this.toasty.success('Success');
      this.router.navigate(['/requestPayout']);
    })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  approve(item) {
    if (this.status === 'approved') {
      return this.toasty.error('This request has been approved, can not be changed status');
    }
    if (this.status === 'rejected') {
      return this.toasty.error('This request has been rejected, can not be changed status');
    }
    this.payoutService.approve(item._id, { note: this.info.note }).then(res => {
      this.toasty.success('Success');
      this.router.navigate(['/requestPayout']);
    })
      .catch(() => this.toasty.error('Something went wrong, please try again!'))
  }

  OpenPayoutModel(content){
    this.payoutModalRef = this.modalService.open(content, { size: 'sm' });
  }

  doPayout(){

    this.payoutService.doPayout({id: this.item._id, paidPayoutAmount: this.payoutAmount }).then(res => {
      if(!res.data.success){
        this.toasty.error(res.data.message);
        this.payoutModalRef.close();
      } else {
        this.toasty.success('Payout has been successfully.');
        this.payoutModalRef.close();
        this.router.navigate(['/requestPayout']);
      }
      
    })
      .catch(() => this.toasty.error('Something went wrong, please try again!'))
    
  }

}
