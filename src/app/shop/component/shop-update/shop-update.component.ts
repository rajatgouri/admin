import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'shop-update',
  templateUrl: './shop-update.html'
})
export class ShopUpdateComponent implements OnInit {
  public isSubmitted = false;
  public shop: any = {};
  public tab: string = 'basic';

  constructor(private router: Router, private shopService: ShopService, private route: ActivatedRoute) {
    let id = route.snapshot.params.id;
    this.shopService.findOne(id).then(resp => {
      this.shop = resp.data;
    });
  }

  ngOnInit() {
  }

  changeTab(tab: string) {
    this.tab = tab;
  }
}
