import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { LoadingComponent } from './components/loading/loading.component';



@NgModule({
  declarations: [
    SidebarComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [SidebarComponent, LoadingComponent],
})
export class SharedModule { }
