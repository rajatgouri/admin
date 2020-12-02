import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { ProducttransactiontypeService } from '../services/producttransactiontype.service';
import { LocationService } from '../../shared/services';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import {NgbDateStruct, NgbCalendar, NgbDateParserFormatter, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { ProducttypeService } from '../services/producttype.service';

@Component({
  selector: 'product-create',
  templateUrl: './form.html',
  styles: [`.form-control-custom { width: 300px; }`]
})
export class ProductCreateComponent implements OnInit {
  public product: any = {
    name: '',
    description: '',
    specifications: [],
    mainImage: null,
    metaSeo: {
      keywords: '',
      description: ''
    },
    type: 'physical',
    categoryId: '',
    freeShip: true,
    dailyDeal: false,
    featured: false,
    isActive: true,
    price: 0,
    salePrice: 0,
    zipcode: '',
    vat: 0,
    restrictFreeShipAreas: [],
    restrictCODAreas: [],
    notification: true
  };
  public showZipcode = true;
  public tree: any = [];
  public transactionType: any = [];
  public productType: any[] = [];
  public countries: any = [];
  public states: any = [];
  public cities: any = [];
  public zipCode: any = '';
  public freeCountry: any;
  public freeState: any;
  public freeCity: any;
  public newSpecification: any = {
    key: '',
    value: ''
  };
  public imageUrl: any = '';
  public images: any = [];
  public mainImage: any = '';
  public tab = 'info';
  public freeShipAreas: any = [];
  public restrictCODAreas: any = '';
  public dealDate: any;
  public imagesOptions: any = {
    multiple: true
  };
  public seller: any;
  public searching: any = false;
  public searchFailed: any = false;
  public fileOptions: any = {};
  public transactionTypeText: any = '';
  public startDate: any = '';
  public endDate: any = '';
  
  // search seller
  formatterClinic = (x: {
    name: string,
    owner: {
      name: string
    }
  }) => {
    if (x.owner && x.owner.name) {
      return x.name + ' (' + x.owner.name + ')';
    } else {
      return x.name + ' (N/A)';
    }
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.productService.findSeller({ name: term }).then((res) => {
          if (res) {
            this.searchFailed = false;
            this.searching = false;
            return res.data.items;
          }
          this.searchFailed = true;
          this.searching = false;
          return of([]);
        })
      )
    )

    model: NgbDateStruct;
    today = this.calendar.getToday();
    placement = 'bottom';
    public fromDate: any;
    public toDate: any;

  constructor(private router: Router, 
    private categoryService: ProductCategoryService,
    private productService: ProductService, 
    private producttransactiontypeService: ProducttransactiontypeService,
    private toasty: ToastyService, 
    private location: LocationService,
    private calendar: NgbCalendar, 
    private formatter: NgbDateParserFormatter,
    private producttypeService: ProducttypeService
  ) {

    this.fromDate = calendar.getToday();
  }

  ngOnInit() {
    this.fileOptions = {
      url: window.appConfig.apiBaseUrl + '/media/files',
      onFinish: (resp) => {
        this.product.digitalFileId = resp.data._id;
      }
    };
    this.location.countries().then((resp) => {
      this.countries = resp.data;
    });

    this.categoryService.tree()
      .then(resp => (this.tree = this.categoryService.prettyPrint(resp.data)));

    //This is for transaction type  
    this.producttransactiontypeService.findForDropdown()
    .then((resp) => {
        this.transactionType = resp.data;
    });
    
    this.producttypeService.findForDropdown()
    .then((resp) => {
        this.productType = resp.data;
    });
    
  }

  submit(frm: any) {
    if (frm.invalid) {
      return this.toasty.error('Invalid form, please check again.');
    }

    if (this.seller) {
      this.product.shopId = this.seller._id;
    } else if (!this.seller) {
      return this.toasty.error('Please select Seller');
    }

    if(this.transactionTypeText === 'Rent' || this.transactionTypeText === 'Share') {
      this.product.salePrice = this.product.price;
    }
    
    if(this.transactionTypeText == 'Rent'){
      if (this.product.price == '' || this.product.price < 0.1) {
        return this.toasty.error('Price is invalid.');
      }
      if (this.product.pricePerWeek == '' || this.product.pricePerWeek < 0.1) {
        return this.toasty.error('Price per week is invalid.');
      }
      if (this.product.pricePerMonth == '' || this.product.pricePerMonth < 0.1) {
        return this.toasty.error('Price per month is invalid.');
      }
    } else {
      if (this.product.salePrice > this.product.price || this.product.salePrice < 0.1 || this.product.price < 0.1) {
        return this.toasty.error('Price or sale price is invalid.');
      }
    }

    if(!this.product.zipcode.trim()) {
      return this.toasty.error(' Please enter zipcode');
    }
    
    if(this.fromDate){
      this.product.startDate = this.formatter.format(this.fromDate);
    }

    if(this.toDate){
      this.product.endDate = this.formatter.format(this.toDate);
    }

    if (this.product.dailyDeal && this.dealDate) {
      this.product.dealTo = new Date(this.dealDate.year, this.dealDate.month - 1, this.dealDate.day).toUTCString();
    }
    this.freeShipAreas.forEach((item) => {
      const data = _.pick(item, ['areaType', 'value', 'name']);
      this.product.restrictFreeShipAreas.push(data);
    });
    this.product.images = this.images.map(i => i._id);
    this.product.mainImage = this.mainImage || null;

    

    if (this.product.type === 'digital' && !this.product.digitalFileId) {
      return this.toasty.error('Please select Digital file path!');
    }

    this.productService.create(this.product)
      .then(() => {
        this.toasty.success('Product has been created');
        this.router.navigate(['/products', { queryParams: { tab: 'spec' } }]);
      }, err => this.toasty.error(err.data.data.details[0].message || err.data.message || 'Something went wrong!'));
  }

  changeAlias() {
    this.product.alias = this.product.name.split(' ').join('-');
  }

  addSpecification() {
    if (!this.newSpecification.value.trim()) {
      return this.toasty.error('Please enter specification value');
    }
    this.product.specifications.push(this.newSpecification);
    this.newSpecification = { key: '', value: '' };
  }

  selectImage(media: any) {
    // this.product.mainImage = media._id;
    // this.imageUrl = media.fileUrl;
    if (media.type !== 'photo') {
      return this.toasty.error('Please select image!');
    }

    this.images.push(media);
  }

  // selectDigital(media: any) {
  //   this.product.digitalFileId = media._id;
  // }

  selectedItem(event) {
    if(event.item.zipcode) {
      this.product.zipcode =  event.item.zipcode;
      this.showZipcode = false;
    }
  }

  setMain(media: any) {
    this.mainImage = media._id;
  }

  removeImage(media: any, index: any) {
    if (media._id === this.mainImage) {
      this.mainImage = null;
    }
    this.images.splice(index, 1);
  }

  changeTab(tab: string) {
    this.tab = tab;
  }

  loadStates(COD: any) {
    this.location.states({ country: COD }).then((res) => {
      this.states = res.data;
    });
  }

  loadCities(id: any) {
    this.location.cities({ state: id }).then((res) => {
      this.cities = res.data;
    });
  }

  addFreeShipAreas() {
    if (this.zipCode) {
      const data = {
        areaType: 'zipcode',
        value: this.zipCode
      };
      this.freeShipAreas.push(data);
      this.zipCode = '';
    } else if (!this.zipCode && this.freeCountry && !this.freeState) {
      const data = {
        areaType: 'country',
        value: this.freeCountry.isoCode,
        name: this.freeCountry.name
      };
      this.freeShipAreas.push(data);
      this.freeCountry = {};
    } else if (!this.zipCode && this.freeCountry && this.freeState && !this.freeCity) {
      const data = {
        areaType: 'state',
        value: this.freeState._id,
        name: this.freeState.name
      };
      this.freeShipAreas.push(data);
      this.freeState = {};
    } else if (!this.zipCode && this.freeCountry && this.freeState && this.freeCity) {
      const data = {
        areaType: 'city',
        value: this.freeCity._id,
        name: this.freeCity.name
      };
      this.freeShipAreas.push(data);
      this.freeCity = {};
    }
  }

  addRestrictCODAreas() {
    if (this.restrictCODAreas) {
      this.product.restrictCODAreas.push(this.restrictCODAreas);
      this.restrictCODAreas = '';
    }
  }

  removeArea(index: number) {
    this.freeShipAreas.splice(index, 1);
  }

  removeCodeArea(index: number) {
    this.product.restrictCODAreas.splice(index, 1);
  }

  removeSpec(i: number) {
    this.product.specifications.splice(i, 1);
  }

  transactionTypeChange($event){
    this.transactionTypeText = $event.target.options[$event.target.options.selectedIndex].text;
  }
  
  validateAvailableDate(){
    let startDate = this.formatter.format(this.fromDate);
    let endDate = this.formatter.format(this.toDate);
    if(startDate!='' && endDate !='')
    {
      if(startDate > endDate){
        return this.toasty.error('To date is grater then from date');
      }
    }
  }
}
