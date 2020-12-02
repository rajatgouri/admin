import * as $ from "jquery";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";

import { RestangularModule, Restangular } from "ngx-restangular";
import { ToastyModule } from "ng2-toasty";
import { NgSelectModule } from "@ng-select/ng-select";
import { SortablejsModule } from "ngx-sortablejs";

import { FullComponent } from "./layouts/full/full.component";
import { AuthLayoutComponent } from "./layouts/auth/auth.component";

import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { BreadcrumbComponent } from "./shared/breadcrumb/breadcrumb.component";
import { AuthService, LocationService } from "./shared/services";
import { AuthGuard } from "./shared/guard/auth.guard";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { ImageCropperModule } from "ngx-image-cropper";

import { Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";

import { MediaModule } from "./media/media.module";
import { ConfigResolver } from "./shared/resolver";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PhoneverifyModule } from "./shared/phoneverify/phoneverify.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

// Function for setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider) {
  //TODO - change default config
  RestangularProvider.setBaseUrl(window.appConfig.apiBaseUrl);
  RestangularProvider.addFullRequestInterceptor(
    (element, operation, path, url, headers, params) => {
      //Auto add token to header
      headers.Authorization = "Bearer " + localStorage.getItem("accessToken");
      headers.platform = window.appConfig.platform;
      return {
        headers: headers,
      };
    }
  );

  RestangularProvider.addErrorInterceptor(
    (response, subject, responseHandler) => {
      //force logout and relogin
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isLoggedin");
        window.location.href = "/auth/login";

        return false; // error handled
      }

      return true; // error not handled
    }
  );
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, `${window.appConfig.apiBaseUrl}/i18n/`, '.json');
  // return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    AuthLayoutComponent,
    BreadcrumbComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    PerfectScrollbarModule,
    // Importing RestangularModule and making default configs for restanglar
    RestangularModule.forRoot(RestangularConfigFactory),
    ToastyModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgSelectModule,
    SortablejsModule.forRoot({ animation: 150 }),
    ImageCropperModule,
    MediaModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PhoneverifyModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy, //HashLocationStrategy
    },
    AuthService,
    AuthGuard,
    LocationService,
    ConfigResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
