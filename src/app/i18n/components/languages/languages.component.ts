import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { LanguageService } from '../../services/language.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'languages.html'
})
export class LanguagesComponent implements OnInit {
  public items = [];
  public page = 1;
  public total = 0;

  constructor(private router: Router, private service: LanguageService,
    private toasty: ToastyService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.service.search({
      page: this.page
    })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this language?')) {
      this.service.remove(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }

  addNew() {
    const modalRef = this.modalService.open(NewLanguageModalComponent, {
      size: 'sm'
    });

    modalRef.result.then(result => {
      this.toasty.success('New language as been added');
      this.items.push(result);
    }, () => (null));
  }

  update(item: any, field: any, status: boolean) {
    const update = {};
    update[field] = status;
    this.service.update(item._id, update)
      .then(resp => {
        item[field] = status;
        if (field === 'isDefault' && status) {
          this.items.forEach(i => {
            i.isDefault = i._id === item._id;
          });
        }
      })
      .catch(e => this.toasty.error('Something went wrong, please try again later!'));
  }
}

@Component({
  templateUrl: 'new-language-modal.html'
})
export class NewLanguageModalComponent implements OnInit {
  public newLang: any = {
    isDefault: false,
    isActive: false,
    name: '',
    key: ''
  };
  public langs: any = [];
  public isoLangs: any = {};
  public submitted: boolean = false;

  constructor(private router: Router, private service: LanguageService,
    private toasty: ToastyService, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.isoLangs = this.service.isoLangs;
    this.langs = Object.keys(this.service.isoLangs);
  }

  create(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }

    this.service.create(this.newLang)
      .then(resp => this.activeModal.close(resp.data))
      .catch(err => this.toasty.error(err.data.data && err.data.data.message ? err.data.data.message : 'Something went wrong, please try again!'));
  }
}
