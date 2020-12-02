import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MediaService } from '../service';
@Component({
  selector: 'media-preview',
  template: `
  <span class="media-preview">
    <img class="img-fluid img-thumbnail media-gallery-item"
      [src]="media?.thumbUrl" alt=""
      *ngIf="media?.type === 'photo'" />
    <i class="fa fa-video media-gallery-item" *ngIf="media?.type === 'video'"></i>
    <i class="fa fa-file media-gallery-item" *ngIf="media?.type === 'file'"></i>
  </span>
  `
})
export class MediaPreviewComponent implements OnInit, OnDestroy {
  @Input() media: any;
  private timeout: any;

  constructor(private service: MediaService) { }

  ngOnInit() {
    if (this.media && !this.media.uploaded) {
      this.updateThumb();
    }
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  updateThumb() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (!this.media.uploaded) {
      this.media.thumbUrl = '/assets/images/processing.webp';
      this.service.findOne(this.media._id)
        .then((resp) => {
          if (resp.data.uploaded) {
            this.media = resp.data;
          } else {
            this.timeout = setTimeout(this.updateThumb.bind(this), 5000);
          }
        });
    }
  }
}
