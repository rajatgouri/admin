import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ComplainService {

  constructor(private restangular: Restangular) { }

  create(data: any): Promise<any> {
    return this.restangular.all('complains').post(data).toPromise();
  }

  update(id, data: any): Promise<any> {
    return this.restangular.one('complains', id).customPUT(data).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('complains').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('complains', id).get().toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('complains', id).customDELETE().toPromise();
  }
}
