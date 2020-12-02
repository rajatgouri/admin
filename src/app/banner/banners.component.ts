import { Component, OnInit } from '@angular/core';
import { BannerService } from './service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  templateUrl: './banners.html'
})
export class BannersComponent implements OnInit {
  public items = [];
  public page = 1;
  public total = 0;
  public title: string = '';

  constructor(private router: Router, private bannerService: BannerService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.bannerService.search({
      page: this.page,
      title: this.title
    })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
    }
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this banner?')) {
      this.bannerService.remove(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch((err) => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }
}

@Component({
  templateUrl: './form.html'
})
export class BrandCreateComponent implements OnInit {
  public banner: any = {
    name: '',
    alias: '',
    description: '',
    settings: {},
    position: 'default'
  };
  public media: any;

  constructor(private router: Router, private bannerService: BannerService, private toasty: ToastyService) {
  }

  ngOnInit() { }

  selectMedia(media: any) {
    this.media = media;
  }

  submit(frm: any) {
    if (!this.banner.title) {
      return this.toasty.error('Please enter banner name');
    }

    if (this.media) {
      this.banner.mediaId = this.media._id;
    } else {
      return this.toasty.error('Please browse banner image');
    }

    this.bannerService.create(this.banner)
      .then(() => {
        this.toasty.success('Brand has been created');
        this.router.navigate(['/banners']);
      }, err => this.toasty.error(err.data.message || 'Something went wrong!'));
  }
}

@Component({
  templateUrl: './form.html'
})
export class BrandUpdateComponent implements OnInit {
  public banner: any;
  public media: any;

  constructor(private router: Router, private route: ActivatedRoute, private bannerService: BannerService, private toasty: ToastyService) {
  }

  ngOnInit() {
    let bannerId = this.route.snapshot.paramMap.get('id');
    this.bannerService.findOne(bannerId)
      .then(resp => {
        this.banner = resp.data;
        if (resp.data.media) {
          this.media = resp.data.media;
          this.banner.mediaId = resp.data.media._id;
        }
      });
  }

  selectMedia(media: any) {
    this.media = media;
  }

  submit(frm: any) {
    if (!this.banner.title) {
      return this.toasty.error('Please enter banner name');
    }

    if (this.media) {
      this.banner.mediaId = this.media._id;
    } else {
      return this.toasty.error('Please browse banner image');
    }

    this.bannerService.update(this.banner._id, this.banner)
      .then(() => {
        this.toasty.success('banner has been updated');
        this.router.navigate(['/banners']);
      }, err => this.toasty.error(err.data.message || 'Something went wrong!'));
  }
}
