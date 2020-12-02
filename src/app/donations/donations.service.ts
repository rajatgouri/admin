import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DonationsService {
  constructor(private restangular: Restangular) { }


  getDonations(params: any): Promise<any> {
    return this.restangular.one('payment/donations/get-donations').customPOST(Object.assign(params, {})).toPromise();
  }
}
