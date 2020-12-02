import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReviewService {

  constructor(private restangular: Restangular) { }

  search(params: any): Promise<any> {
    return this.restangular.one('reviews').get(params).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('reviews', id).customDELETE().toPromise();
  }

}
