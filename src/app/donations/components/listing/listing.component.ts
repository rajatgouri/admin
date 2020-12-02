import { Component, OnInit, Input } from '@angular/core';
import { DonationsService } from '../../donations.service';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'donations-listing',
  templateUrl: './listing.html'
})
export class ListingComponent implements OnInit {
 
  public donations = [];
	public page: Number = 1;
	public take: Number = 10;
	public total: Number = 0;
	public searchFields: any = {
		status: ''
	};

	public sortOption = {
		sortBy: 'createdAt',
		sortType: 'desc'
	};
	public isLoading = false;
  constructor(private router: Router, private donationsService: DonationsService, private toasty: ToastyService) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
		console.log('y')
		this.isLoading = true;
		const params = Object.assign({
			page: this.page,
			take: this.take,
			sort: `${this.sortOption.sortBy}`,
			sortType: `${this.sortOption.sortType}`
		}, this.searchFields);

		this.donationsService.getDonations(params).then(res => {
			this.isLoading = false;

			this.donations = res.data.data;
			this.total = res.data.count;
		})
		.catch(err => {
			this.isLoading = false;
			this.toasty.error('Something went wrong, please try again!');	
		})
	}

	sortBy(field: string, type: string) {
		this.sortOption.sortBy = field;
		this.sortOption.sortType = type;
		this.query();
	}

}
