import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services';
import { ToastyService } from 'ng2-toasty';

@Component({
	templateUrl: 'forgot.html'
})
export class ForgotComponent {
	email: string = '';
	submitted: boolean = false;
	Auth: AuthService;

	constructor(auth: AuthService, public router: Router, private toasty: ToastyService) {
		this.Auth = auth;
  }

	forgot() {
		this.submitted = true;
		this.Auth.forgot(this.email).then((resp) => {
			this.toasty.success('New password has been sent, please check your email inbox.');
		})
		.catch((err) => this.toasty.error(err.data.data.message))
	}
}
