import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReportSaleService {
  constructor(private restangular: Restangular) { }

  saleStat(param: any): Promise<any> {
    return this.restangular.one('orders/seller/stats/sale').get(param).toPromise();
  }
}
