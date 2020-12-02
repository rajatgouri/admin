import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'configs',
  templateUrl: './configs.html'
})
export class ConfigsComponent implements OnInit {
  public items = [];
  constructor(private configService: ConfigService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.configService.list()
      .then(resp => this.items = resp.data.items)
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  save(item: any) {
    if (item.type === 'number' && item.value < 0) {
      return this.toasty.error('Please enter positive number!')
    }

    this.configService.update(item._id, item.value)
      .then(() => this.toasty.success('Updated successfully!'))
      .catch(e => this.toasty.error('Something went wrong, please try again!'));
  }

  selectMedial(media: any, index: number) {
    if (media.type !== 'photo') {
      return this.toasty.error('Please select image mime type.');
    }
    this.items[index].value = media.fileUrl;
  }

  selectIcon(media: any, index: number) {
    if (media.type !== 'photo') {
      return this.toasty.error('Please select image mime type.');
    }
    this.items[index].value.iconUrl = media.fileUrl;
  }
}
