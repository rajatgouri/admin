import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { ProducttransactiontypeService } from '../services/producttransactiontype.service';
import { LocationService } from '../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
import { Options } from 'angular-2-daterangepicker';
import * as moment from 'moment';
import {NgbDateStruct, NgbCalendar, NgbDateParserFormatter, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { ProducttypeService } from '../services/producttype.service';
import { ShopService } from '../../shop/services/shop.service';

@Component({
  selector: 'product-update',
  templateUrl: './form.html',
  styles: [`
    .form-group.hidden {
      width: 0;
      margin: 0;
      border: none;
      padding: 0;
    }
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `]
})
export class ProductUpdateComponent implements OnInit {
  public product: any;
  public tree: any = [];
  public transactionType: any = [];
  public productType: any[] = [];
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
  public countries: any = [];
  public states: any = [];
  public cities: any = [];
  public zipCode: any = '';
  public freeCountry: any;
  public freeState: any;
  public freeCity: any;
  public dealDate: any;
  public imagesOptions: any = {
    multiple: true
  };
  public isUpdate: any = true;
  public fileOptions: any = {};
  public transactionTypeText: any = '';
  public seller: any;

  hoveredDate: NgbDate | null = null;

  model: NgbDateStruct;
  today = this.calendar.getToday();
  placement = 'bottom';
  public fromDate: any ;
  public toDate: any;


  constructor(private router: Router, private route: ActivatedRoute, private categoryService: ProductCategoryService,
    private productService: ProductService,
    private producttransactiontypeService: ProducttransactiontypeService,
    private toasty: ToastyService,
    private location: LocationService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private producttypeService: ProducttypeService,
    private shopService: ShopService) {
    if (route.snapshot.queryParams.tab) {
      this.tab = route.snapshot.queryParams.tab;
    }

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {
    this.fileOptions = {
      url: window.appConfig.apiBaseUrl + '/media/files',
      onFinish: (resp) => {
        this.product.digitalFileId = resp.data._id;
      }
    };

    //This is for transaction type
    this.producttransactiontypeService.findForDropdown()
    .then((resp) => {
        this.transactionType = resp.data;
    });



    this.producttypeService.findForDropdown()
    .then((resp) => {
        this.productType = resp.data;
    });


    const id = this.route.snapshot.paramMap.get('id');
    this.productService.findOne(id)
      .then(resp => {
        this.product = resp.data;
        this.getSeller(this.product.shopId)
        if (this.product.dailyDeal && this.product.dealTo) {
          const day = new Date(this.product.dealTo).getDate();
          const month = new Date(this.product.dealTo).getMonth() + 1;
          const year = new Date(this.product.dealTo).getFullYear();
          this.dealDate = {
            year: year,
            month: month,
            day: day
          };
        }
        this.freeShipAreas = resp.data.restrictFreeShipAreas;
        this.mainImage = resp.data.mainImage ? resp.data.mainImage._id : null;
        this.images = this.product.images;

        //This is to set transcation set for hide and show
        this.transactionType.map((value) => {
          if(value._id == this.product.transactiontypeId){
            console.log(value._id+' - '+this.product.transactiontypeId);
            this.transactionTypeText = value.name;
          }
        });

        if(this.product.startDate){
          if (this.product.startDate !== '1970-01-01T00:00:00.000Z') {
            this.fromDate = {year: moment(this.product.startDate).year(), month: moment(this.product.startDate).month()+1, day: moment(this.product.startDate).date()};          } 
        }
        if(this.product.endDate ){
         if(this.product.endDate !== '1970-01-01T00:00:00.000Z') {
          this.toDate = {year: moment(this.product.endDate).year(), month: moment(this.product.endDate).month()+1, day: moment(this.product.endDate).date()};
         }
        }

    });

    this.categoryService.tree()
      .then(resp => (this.tree = this.categoryService.prettyPrint(resp.data)));

    this.location.countries().then((resp) => {
      this.countries = resp.data;
    });

  }

  getSeller(shop) {
    this.shopService.findOne(shop).then(res => {
      this.seller = res.data;
    }).catch(err => {
      this.toasty.error('Something Went Wrong!')
    })
  }

  submit(frm) {
    if (frm.$invalid) {
      this.toasty.error('Invalid form, please check again.');
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

    if(this.fromDate){
      this.product.startDate = this.formatter.format(this.fromDate);
    }


    if(this.toDate && this.toDate != 'null'){
      this.product.endDate = this.formatter.format(this.toDate);
    } else {
      this.product.endDate = '';
    }


    if (this.product.dailyDeal && this.dealDate) {
      this.product.dealTo = new Date(this.dealDate.year, this.dealDate.month - 1, this.dealDate.day).toUTCString();
    }

    if (this.product.type === 'digital' && !this.product.digitalFileId) {
      return this.toasty.error('Please select Digital file path!');
    }

    this.product.restrictFreeShipAreas = [];
    this.freeShipAreas.forEach((item) => {
      const data = _.pick(item, ['areaType', 'value', 'name']);
      this.product.restrictFreeShipAreas.push(data);
    });
    this.product.images = this.images.map(i => i._id);
    this.product.mainImage = this.mainImage || null;
    this.product.zipcode = this.product.location.zipcode || this.seller.zipcode;

    if(!this.product.zipcode) {
      return this.toasty.error('Seller zipcode needs to be update!')
    }

    this.productService.update(this.product._id, this.product).then(resp => {
      this.toasty.success('Updated successfully.');
      this.router.navigate(['/products']);
    });
  }

  changeAlias() {
    this.product.alias = this.product.name.split(' ').join('-');;
  }

  addSpecification() {
    if (!this.newSpecification.value.trim()) {
      return this.toasty.error('Please enter specification value');
    }
    this.product.specifications.push(this.newSpecification);
    this.newSpecification = { key: '', value: '' };
  }

  selectImage(media: any) {
    if (media.type !== 'photo') {
      return this.toasty.error('Please select image!');
    }

    this.images.push(media);
  }

  setMain(media: any) {
    this.mainImage = media._id;
  }

  // selectDigital(media: any) {
  //   this.product.digitalFileId = media._id;
  // }

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
    if(startDate && endDate)
    {
      if(startDate > endDate){
        return this.toasty.error('To date is grater then from date');
      }
    }
  }

  /*onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }*/
}
