import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StatService {
  constructor(private restangular: Restangular) { }

  prodStat(): Promise<any> {
    return this.restangular.one('products/seller/stats').get().toPromise();
  }

  shopStat(): Promise<any> {
    return this.restangular.one('shops', 'stats').get().toPromise();
  }

  userStat(): Promise<any> {
    return this.restangular.one('users', 'stats').get().toPromise();
  }

  orderStat(): Promise<any> {
    return this.restangular.one('orders/seller/stats').get().toPromise();
  }
}
