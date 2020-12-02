import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class ProductCategoryService {
  private allowFields = [
    'name', 'alias', 'description', 'ordering', 'parentId', 'mainImage',
    'specifications', 'chemicalIdentifiers', 'metaSeo'
  ];
  constructor(private restangular: Restangular) { }

  create(data: any): Promise<any> {
    return this.restangular.all('products/categories').post(_.pick(data, this.allowFields)).toPromise();
  }

  tree(): Promise<any> {
    return this.restangular.one('products/categories', 'tree').get().toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('products/categories', id).get().toPromise();
  }

  update(id,data): Promise<any> {
    return this.restangular.one('products/categories', id).customPUT(_.pick(data, this.allowFields)).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('products/categories', id).customDELETE().toPromise();
  }

  prettyPrint(tree: any, char: string = '', results: any = []) {
    tree.forEach(item => {
      item.name = `${char}${item.name}`;
      results.push(item);
      if (item.children && item.children.length) {
        this.prettyPrint(item.children, `${char}__`, results);
      }
    });

    return results;
  }

  removeChild(tree: any, id: string) {
    tree.forEach((item, index, object) => {
      if (item._id === id) {
        object.splice(index, 1);
        delete item.children;
      }
      if (item.children) {
        this.removeChild(item.children, id);
      }
    });
  }

  populateAttributes(category: any, product: any, attribute: string) {
    // populate field of product specification and product chemical
    // TODO - keep field have data
    // TODO - find product category data
    const items = product[attribute]
      .filter(item => !_.isEmpty(item.key));
    product[attribute] = [];
    category[attribute].forEach(key => product[attribute].push({ key, value: '' }));
    items.reverse().forEach((item: any, index, object) => {
      const i = _.findIndex(product[attribute], (a:any) => a.key.trim() === item.key.trim());
      if (i > -1) {
        product[attribute][i].value = item.value;
      } else {
        product[attribute].unshift(item);
      }

      object.splice(index, 1);
    });
  }

  getParentAttributes(tree: any, parentId: string) {
    let data = {specifications: [], chemicalIdentifiers: []};
    if (!parentId) {
      return data;
    }
    const parent = _.find(tree, c => c._id === parentId);
    if (!parent) {
      return data;
    }
    if (parent.specifications && parent.specifications.length || parent.chemicalIdentifiers && parent.chemicalIdentifiers.length) {
      data.specifications = parent.specifications || [];
      data.chemicalIdentifiers = parent.chemicalIdentifiers || [];

      return data;
    } else if (!parent.parentId) {
      return data;
    }

    this.getParentAttributes(tree, parent.parentId);
  }
}
