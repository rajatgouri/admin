import { TestBed } from '@angular/core/testing';

import { ProducttransactiontypeService } from './producttransactiontype.service';

describe('ProducttransactiontypeService', () => {
  let service: ProducttransactiontypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducttransactiontypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
