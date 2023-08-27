import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RequestInterceptor } from './shared/interceptors/request.interceptor';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ProductFormComponent } from './product/components/product-form/product-form.component';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { LoginFormComponent } from './auth/components/login-form/login-form.component';
import { RegisterFormComponent } from './auth/components/register-form/register-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ProductService } from './services/product.service';
import { AuthService } from './services/auth.service';
import { UtilService } from './services/util.service';

let components = [
  AppComponent,
  SidebarComponent,
  LoadingComponent,
  ProductFormComponent,
  ProductListComponent,
  LoginFormComponent,
  RegisterFormComponent
];

let modules = [
  BrowserModule,
  AppRoutingModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  HttpClientModule,
]

let services = [
  LoadingService,
  ProductService,
  AuthService,
  UtilService,
]

@NgModule({
  declarations: [...components],
  imports: [...modules],
  providers: [
    ...services,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
