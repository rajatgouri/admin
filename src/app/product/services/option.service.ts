import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class OptionService {
  private allowFields = [
    'name', 'key', 'options', 'description'
  ];
  constructor(private restangular: Restangular) { }

  create(data: any): Promise<any> {
    return this.restangular.all('products/options').post(_.pick(data, this.allowFields)).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('products/options').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('products/options', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    let fields = _.pick(data, this.allowFields);
    delete fields.key;
    return this.restangular.one('products/options', id).customPUT(fields).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('products/options', id).customDELETE().toPromise();
  }
}
