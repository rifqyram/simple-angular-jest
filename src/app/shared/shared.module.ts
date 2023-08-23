import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';



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
  providers: [LoadingService]
})
export class SharedModule { }
