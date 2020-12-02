import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RefundService {
  constructor(private restangular: Restangular) { }

  search(params: any): Promise<any> {
    return this.restangular.one('refundRequests').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('refundRequests', id).get().toPromise();
  }
}
