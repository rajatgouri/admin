import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ShopService {
  constructor(private restangular: Restangular) { }

  create(credentials: any): Promise<any> {
    return this.restangular.all('shops').post(credentials).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('shops', 'search').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('shops', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('shops', id).customPUT(data).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('shops', id).customDELETE().toPromise();
  }

  findOwner(params: any): Promise<any> {
    return this.restangular.one('users', 'search').get(params).toPromise();
  }
}
