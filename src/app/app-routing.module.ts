import { NgModule } from '@angular/core';
import { ProductFormComponent } from './product/components/product-form/product-form.component';
import { ProductListComponent } from './product/components/product-list/product-list.component';
import { RegisterFormComponent } from './auth/components/register-form/register-form.component';
import { LoginFormComponent } from './auth/components/login-form/login-form.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterFormComponent,
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'add',
        component: ProductFormComponent,
      },
      {
        path: 'edit/:id',
        component: ProductFormComponent,
      },
      {
        path: '',
        component: ProductListComponent
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
