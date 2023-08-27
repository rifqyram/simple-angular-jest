import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isExpand: boolean = true;
  isLoggedIn: Observable<boolean> = this.authService.isLoggedIn$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) { }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    const user = this.authService.getUserFromStorage();
    if (user) {
      this.authService.getUserInfo()
        .subscribe();
    }
  }

  handleLogout() {
    this.authService.clearUserStorage();
    this.router.navigate(['/login'])
  }

  handleExpanded() {
    this.isExpand = !this.isExpand;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    let width = window.innerWidth;

    if (width < 768) {
      this.isExpand = false;
    } else {
      this.isExpand = true;
    }
  }
}
