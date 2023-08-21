import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { LoadingService } from './shared/services/loading.service';
import { AuthResponse } from './auth/models/IAuthModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isExpand: boolean = false;
  isLoggedIn: boolean = false;
  windowWidth: number = window.innerWidth;
  isLoading: Observable<boolean> = this.loadingService.loading;

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private readonly loadingService: LoadingService
  ) {

  }

  ngOnInit(): void {
    this.onChangeRoute();

    if (this.windowWidth > 768)
      this.isExpand = true;
  }

  private onChangeRoute() {
    this.loadingService.showLoading();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe({
        next: () => {
          this.fetchUserInfo();
          this.loadingService.hideLoading();
        },
      });
  }

  private fetchUserInfo() {
    const currentUser = this.authService.getUserFromStorage();

    if (currentUser) {
      this.isLoggedIn = true;
    }
  }

  handleLogout() {
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login')
    this.authService.clearUserStorage()
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    this.windowWidth = window.innerWidth;

    if (this.windowWidth < 768) {
      this.isExpand = false;
    }
  }

}
