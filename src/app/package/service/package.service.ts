import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class PackageService {

  constructor(private restangular: Restangular) { }

  create(data: any): Promise<any> {
    return this.restangular.all('packages/featured').post(data).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('packages/featured').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('packages/featured', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('packages/featured', id).customPUT(data).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('packages/featured', id).customDELETE().toPromise();
  }

  history(params: any): Promise<any> {
    return this.restangular.one('payment/invoices').get(params).toPromise();
  }
}
