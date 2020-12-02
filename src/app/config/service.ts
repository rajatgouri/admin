import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private restangular: Restangular) { }

  list(): Promise<any> {
    return this.restangular.one('system/configs').get().toPromise();
  }

  update(id, value): Promise<any> {
    return this.restangular.one('system/configs', id).customPUT({ value }).toPromise();
  }
}
