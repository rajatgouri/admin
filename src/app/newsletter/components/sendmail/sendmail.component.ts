import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  templateUrl: 'sendmail.html'
})
export class SendmailComponent implements OnInit {
  public data = {
    subject: '',
    content: '',
    userType: ''
  };
  public submitted: boolean = false;

  constructor(private service: NewsletterService,
    private toasty: ToastyService) {
  }

  ngOnInit() { }

  submit(frm: any) {
    this.submitted = true;
    if (frm.invalid || !this.data.subject || !this.data.content) {
      return this.toasty.error('Please enter all content data');
    }

    this.service.sendMail(this.data)
      .then(() => {
        this.data = {
          subject: '',
          content: '',
          userType: ''
        };
        this.toasty.success('Mail has been sent!');
        this.submitted = false;
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }
}
