import { Component, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { Router } from '@angular/router';
import { AuthService } from '../services';

declare var $: any;
@Component({
  selector: 'ap-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu: any = '';
  showSubMenu: any = '';
  public isShowMenu: any = false;
  public sidebarnavItems: any[];
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
  constructor(private router: Router, private authService: AuthService) {
  }
  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
    $(function () {
      $('.sidebartoggler').on('click', function () {
        if ($('#main-wrapper').hasClass('mini-sidebar')) {
          $('body').trigger('resize');
          $('#main-wrapper').removeClass('mini-sidebar');
        } else {
          $('body').trigger('resize');
          $('#main-wrapper').addClass('mini-sidebar');
        }
      });
    });
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/auth/login']);
  }

  showDropdown() {
    this.isShowMenu = !this.isShowMenu;
  }
}
