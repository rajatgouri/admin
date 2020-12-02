import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class OrderService {

  constructor(private restangular: Restangular) { }

  find(params: any): Promise<any> {
    return this.restangular.one('orders').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('orders', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('orders').one('details', id).one('status').customPUT(data).toPromise();
  }
}
